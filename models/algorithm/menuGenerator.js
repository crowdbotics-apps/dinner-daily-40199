const rfr = require('rfr');
const pool = rfr('/db/index');

const dbQuery = rfr('/shared/query');
const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const seasonalRule = rfr('/models/algorithm/seasonalRule');
const ruleConditions = rfr('/models/algorithm/ruleConditions');
const balanceRules = rfr('/models/algorithm/balanceRules');
const restrictionRules = rfr('/models/algorithm/restrictionRules');
const finalRules = rfr('/models/algorithm/finalRules');
const recipePool = rfr('/models/algorithm/recipePool');
const scorer = rfr('/models/algorithm/scorer');

let userRestrictionRuleSets = [];

// Function to fetch all recipes except non seasonal
const _fetchRecipesExceptNonSeasonal = async (seasons, dishType) => {
	let queryParam = dbQuery.fetchRecipesExceptNonSeasonal(seasons, dishType);
	return await pool.query(queryParam)
	.then(([resp]) => {
		return resp;
	}).catch(err => {
		utils.writeErrorLog('menuGenerator', '_fetchRecipesExceptNonSeasonal', 'Error while fetching all recipes from database except non seasonal', err, queryParam);
		throw err.message || err;
	})
}

// Function to remove used recipes from recipe pool
const _fetchRecipePoolAfterUsedRecipe = async (userId, recipePool) => {
	let queryParam = dbQuery.usedRecipeQuery(userId);
	return await pool.query(queryParam)
	.then(([resp]) => {
		const usedRecipeIds = resp.map(recipe => recipe.main_recipe_id); // Extracting the main_recipe_id values from response
		const finalRecipePool = recipePool.filter(recipe => !usedRecipeIds.includes(recipe.id)); // Filtering out id values present in recipePool
		return finalRecipePool;
	}).catch(err => {
			utils.writeErrorLog('menuGenerator', '_fetchRecipePoolAfterUsedRecipe', 'Error while fetching used recipes from database', err, queryParam);
			throw err.message || err;
	})
}

// Function to remove used side recipes from recipe pool
const _fetchRecipePoolAfterUsedSideRecipe = async (userId, sideRecipePool) => {
	let promiseArray = [];
	promiseArray.push(pool.query(dbQuery.usedFirstSideRecipeQuery(userId)), pool.query(dbQuery.usedSecondSideRecipeQuery(userId)));
	return await Promise.all(promiseArray)
	.then((res) => {
		let usedSideRecipeArr = [];
		res.forEach(result => (usedSideRecipeArr = usedSideRecipeArr.concat(...result[0])));
		const usedRecipeIds = usedSideRecipeArr.map(recipe => recipe.id); // Extracting the recipe ids values from response
		const finalSideRecipePool = sideRecipePool.filter(recipe => !usedRecipeIds.includes(recipe.id)); // Filtering out id values present in recipePool
		return finalSideRecipePool;
	}).catch(err => {
			utils.writeErrorLog('menuGenerator', '_fetchRecipePoolAfterUsedSideRecipe', 'Error while fetching used side recipes from database', err);
			throw err.message || err;
	})
}


const _createRecipePoolArr = (recipesPool) => {
	return recipesPool.map(recipe => recipe.id);
}

// Comon function to apply rules and return recipe pool after applying rules
const _applyRules = async (selectedRecipeArr, recipePoolArray, userRestrictionRuleSets, ruleKey) => {
	let filterRuleConditions = await ruleConditions.get(selectedRecipeArr);
	let balanceRuleSets = await balanceRules.get(recipePoolArray, filterRuleConditions, ruleKey);
	let restrictionRuleSets = await restrictionRules.get(recipePoolArray, userRestrictionRuleSets, filterRuleConditions, ruleKey);
	const finalRuleSets = finalRules.get(balanceRuleSets, restrictionRuleSets);
	if (ruleKey === constant['RULE_KEY']['MEAL_RULES'] || ruleKey === constant['RULE_KEY']['MAIN_AND_SIDE_DISH_RULES']) {
		return finalRuleSets;
	} else {
		const finalRecipePool = await recipePool.get(recipePoolArray, finalRuleSets);
		return finalRecipePool;
	}
}

// Function to fetch main menu recipes
const _getMainMenuRecipes = async (userData, seasonArray, userRestrictionRuleSets) => {
	let recipesPoolAfterRemovalOfNonSeasonalRecipes = await _fetchRecipesExceptNonSeasonal(seasonArray, constant['DISH_TYPE']);
	let recipesPoolAfterRemovalOfUsedRecipe = await _fetchRecipePoolAfterUsedRecipe(userData.id, recipesPoolAfterRemovalOfNonSeasonalRecipes);
	let recipePoolArray = _createRecipePoolArr(recipesPoolAfterRemovalOfUsedRecipe);
	let selectedRecipeArr = [];
	for (let index = 0; index < 10; index++) {
		//Apply main dish rules
		const finalRecipePool = await _applyRules(selectedRecipeArr, recipePoolArray, userRestrictionRuleSets, constant['RULE_KEY']['MAIN_DISH_RULES']);
		// Add scorer to each recipe in recipe pool
		const recipePoolWithScorer = await scorer.get(finalRecipePool, userData, selectedRecipeArr);
		selectedRecipeArr.push({id: recipePoolWithScorer[0].id});
		recipePoolArray = finalRecipePool.filter((recipeId) => recipeId !== recipePoolWithScorer[0].id);
	}
	return selectedRecipeArr;
}

// Function to fetch number of possible side recipes for main menu and their categories
const _fetchPossibleSideRecipeAndCategories = async (menuId) => {
	utils.writeInsideFunctionLog('menuGenerator', '_fetchPossibleSideRecipeAndCategories', menuId);
	let queryParam = dbQuery.recipeSideItemsQuery(menuId);
	return await pool.query(queryParam)
	.then(([resp]) => {
		return resp;
	}).catch(err => {
			utils.writeErrorLog('menuGenerator', '_fetchPossibleSideRecipeAndCategories', 'Error while fetching number of side recipes adn their categories of selected menu from database', err, queryParam);
			throw err.message || err;
	})
}

// Function to fetch recipe pool for side one after filter out categories from recipe pool
const _filterSideRecipePoolForCategories = async (sideCategories, sideRecipePool) => {
	utils.writeInsideFunctionLog('menuGenerator', '_filterSideRecipePoolForCategories', sideCategories);
	let queryParam = dbQuery.multipleSearchQuery(constant["DB_TABLE"]["RECIPES"], 'tag_names', sideCategories, ["id"]);
	queryParam += ` and id in (${sideRecipePool})`;
	return await pool.query(queryParam)
	.then(([recipePool]) => {
		return recipePool;
	}).catch(err => {
			utils.writeErrorLog('menuGenerator', '_filterSideRecipePoolForCategories', 'Error while fetching recipe pool for side recipe', err, queryParam);
			throw err.message || err;
	})
}

// Common function to select side dish after apply meal rule and main and side dish rules
const _selectSideRecipeForMenu = async (sideRecipePoolWithScorer, menuId, selectedFirstRecipeId, userRestrictionRuleSets, selectedRecipes, selectedSideRecipeArr, isSecSideRecipe) => {
	let selectedSideRecipe = '';
	for (let i = 0; i < sideRecipePoolWithScorer.length; i++) {
		selectedSideRecipe = sideRecipePoolWithScorer[i];
		let selectedRecipeIdsForMealRule = [menuId, {id: selectedSideRecipe.id}];
		if (!!isSecSideRecipe) {
			selectedRecipeIdsForMealRule.push({id: selectedFirstRecipeId});
		}
		const mealRulesSet = await _applyRules(selectedRecipeIdsForMealRule, [], userRestrictionRuleSets, constant['RULE_KEY']['MEAL_RULES']);
		if (Object.keys(mealRulesSet).length == 0) {
			let selectedRecipeIdsForMainAndSideDishRule = selectedRecipes.concat(selectedSideRecipeArr);
			selectedRecipeIdsForMainAndSideDishRule.push({id: selectedSideRecipe.id});
			const mainAndSideDishRulesSet = await _applyRules(selectedRecipeIdsForMainAndSideDishRule, [], userRestrictionRuleSets, constant['RULE_KEY']['MAIN_AND_SIDE_DISH_RULES']);
			if (Object.keys(mainAndSideDishRulesSet).length == 0) {
				return selectedSideRecipe;
			}
		}
	}
}

// Function to select any random side dish with tag simple salad or simple vegetable when side dish not received after applying rules
const _selectRandomSideDishFromSimpleSaladOrVegetable = async (recipePool) => {
	let queryParam = dbQuery.randomSideDishQuery(recipePool);
	return await pool.query(queryParam)
	.then(([resp]) => {
		return resp[0];
	}).catch(err => {
			utils.writeErrorLog('menuGenerator', '_selectRandomSideDishFromSimpleSaladOrVegetable', 'Error while fetching random side dish from database', err, queryParam);
			throw err.message || err;
	})
}


// Function to select side recipe for menu
const _selectFirstSideRecipeForMenu = async (selectedRecipes, index, userRestrictionRuleSets, possibleSideRecipeCategories, finalSideRecipePool, userData, selectedSideRecipeArr) => {
	const firstSideCategories = possibleSideRecipeCategories.filter(category => category.side === 0).map(category => category.name);
	const sideRecipePoolForFirstSide = await _filterSideRecipePoolForCategories(firstSideCategories, finalSideRecipePool);
	const sideRecipePoolArrayForFirstSide = _createRecipePoolArr(sideRecipePoolForFirstSide);
	const sideRecipePoolWithScorer = await scorer.get(sideRecipePoolArrayForFirstSide, userData, selectedSideRecipeArr);
	let selectedFirstSide = await _selectSideRecipeForMenu(sideRecipePoolWithScorer, selectedRecipes[index], '', userRestrictionRuleSets, selectedRecipes, selectedSideRecipeArr, false);
	if (!selectedFirstSide) {
		selectedFirstSide = await _selectRandomSideDishFromSimpleSaladOrVegetable(finalSideRecipePool);
	}
	return selectedFirstSide;

}

// Function to fetch tag names / categories for the selected side recipe
const _fetchSelectedFirstSideCategories = async (recipeId) => {
	let queryParam = dbQuery.selectQuery(constant["DB_TABLE"]["RECIPES"], ['tag_names'], {id: recipeId} );
	return await pool.query(queryParam)
	.then(([res]) => {
		return res[0].tag_names.split(',');
	}).catch(err => {
			utils.writeErrorLog('menuGenerator', '_fetchSelectedFirstSideCategories', 'Error while fetching categoiresfor selected first side recipe', err, queryParam);
			throw err.message || err;
	})
}

// Function to fetch tag names / categories for the second side recipe for corresponding first side recipe
const _fetchSecSideCategories = async (firstSideCategories, possibleSideRecipeCategories) => {
	utils.writeInsideFunctionLog('menuGenerator', '_fetchSecSideCategories', firstSideCategories);
	utils.writeInsideFunctionLog('menuGenerator', '_fetchSecSideCategories', possibleSideRecipeCategories);
	try {
		const matchingObjId = possibleSideRecipeCategories.filter(obj => obj.side === 0 && firstSideCategories.includes(obj.name)).map(obj => obj.id);
		const secSideCategories = possibleSideRecipeCategories.filter(obj => obj.side === 1 && matchingObjId.includes(obj.id)).map(obj => obj.name);
		return secSideCategories;
	} catch(err) {
		utils.writeErrorLog('menuGenerator', '_fetchSecSideCategories', 'Error while fetching categoiresfor selected first side recipe', err, queryParam);
		throw err.message || err;
	}
}

// Function to selectsecond side recipe for menu
const _selectSecondSideRecipeForMenu = async (selectedRecipes, index, selectedFirstRecipeId, possibleSideRecipeCategories, finalSideRecipePool, userData, selectedSideRecipeArr) => {
	const firstSideCategories = await _fetchSelectedFirstSideCategories(selectedFirstRecipeId);
	const secSideCategories = await _fetchSecSideCategories(firstSideCategories, possibleSideRecipeCategories);
	const sideRecipePoolForFirstSide = await _filterSideRecipePoolForCategories(secSideCategories, finalSideRecipePool);
	const sideRecipePoolArrayForFirstSide = _createRecipePoolArr(sideRecipePoolForFirstSide);
	const sideRecipePoolWithScorer = await scorer.get(sideRecipePoolArrayForFirstSide, userData, selectedSideRecipeArr);
	let selectedSecSide = await _selectSideRecipeForMenu(sideRecipePoolWithScorer, selectedRecipes[index], selectedFirstRecipeId, userRestrictionRuleSets, selectedRecipes, selectedSideRecipeArr, true);
	if (!selectedSecSide) {
		selectedSecSide = await _selectRandomSideDishFromSimpleSaladOrVegetable(finalSideRecipePool);
	}
	return selectedSecSide;
}

// Function to fetch final menu with side recipes
const _getMenuWithSideRecipes = async (selectedRecipes, userData, seasonArray, userRestrictionRuleSets) => {
	let sideRecipesPoolAfterRemovalOfNonSeasonalRecipes = await _fetchRecipesExceptNonSeasonal(seasonArray, constant['SIDE_DISH_TYPE']);
	let recipesPoolAfterRemovalOfUsedSideRecipe = await _fetchRecipePoolAfterUsedSideRecipe(userData.id, sideRecipesPoolAfterRemovalOfNonSeasonalRecipes);
	let sideRecipePoolArray = _createRecipePoolArr(recipesPoolAfterRemovalOfUsedSideRecipe);
	let finalSideRecipePool = [];
	let selectedSideRecipeArr = [];
	for (let index = 0; index < selectedRecipes.length; index++) {
		// Apply side dish rules
		finalSideRecipePool = await _applyRules(selectedSideRecipeArr, sideRecipePoolArray, userRestrictionRuleSets, constant['RULE_KEY']['SIDE_DISH_RULES']);
		const selectedMenuId = selectedRecipes[index].id;
		let possibleSideRecipeAndCategories = await _fetchPossibleSideRecipeAndCategories(selectedMenuId);
		if (!!possibleSideRecipeAndCategories.length) {
			const selectedFirstRecipe = await _selectFirstSideRecipeForMenu(selectedRecipes, index, userRestrictionRuleSets, possibleSideRecipeAndCategories, finalSideRecipePool, userData, selectedSideRecipeArr);
			const selectedFirstRecipeId = selectedFirstRecipe.id;
			selectedRecipes[index]['firstSideId'] = selectedFirstRecipeId;
			selectedSideRecipeArr.push({id: selectedFirstRecipeId});
			sideRecipePoolArray = finalSideRecipePool.filter((recipeId) => recipeId !== selectedFirstRecipeId);
			if (possibleSideRecipeAndCategories[0].number_of_sides === 2) {
				finalSideRecipePool = await _applyRules(selectedSideRecipeArr, sideRecipePoolArray, userRestrictionRuleSets, constant['RULE_KEY']['SIDE_DISH_RULES']);
				const selectedSecRecipe = await _selectSecondSideRecipeForMenu(selectedRecipes, index, selectedFirstRecipeId, possibleSideRecipeAndCategories, finalSideRecipePool, userData, selectedSideRecipeArr);
				const selectedSecRecipeId = selectedSecRecipe.id;
				selectedRecipes[index]['secSideId'] = selectedSecRecipeId;
				selectedSideRecipeArr.push({id: selectedSecRecipeId});
				sideRecipePoolArray = finalSideRecipePool.filter((recipeId) => recipeId !== selectedSecRecipeId);
			}
		}
	}
	return selectedRecipes;
}

const createMenu = async (userData) => {
	try {
		utils.writeInsideFunctionLog('menuGenerator', 'createMenu', userData);
		const seasonArray = await seasonalRule.get();
		userRestrictionRuleSets = await restrictionRules.getAllRules(userData.id);
		let selectedRecipes = await _getMainMenuRecipes(userData, seasonArray, userRestrictionRuleSets);
		let menuWithSideRecipes = await _getMenuWithSideRecipes(selectedRecipes, userData, seasonArray, userRestrictionRuleSets);
		return menuWithSideRecipes;
	} catch (err) {
		utils.writeErrorLog('menuGenerator', 'createMenu', 'Error in create menu function', err);
		throw err.message || err;
	}
}

// Function to create user week menu
const createUserMenu = async (req, res, cb) => {
	utils.writeInsideFunctionLog('menuGenerator', 'createUserMenu');
	let resObj = Object.assign({}, utils.getErrorResObj());
	try {
		const userData = req.userData;
		const menuWithSideRecipes = await createMenu(userData);
		resObj = Object.assign({data: menuWithSideRecipes}, utils.getSuccessResObj());
		cb(resObj);
	} catch (err) {
		utils.writeErrorLog('menuGenerator', 'createUserMenu', 'Error in create user menu function', err);
		resObj['message'] = err.message || err;
		resObj['data'] = err.message || err;
		cb(resObj);
	}
}

module.exports = {
	createUserMenu,
	createMenu
}