module.exports = {
	'DB_NAME': "heroku_52b3caaac7494c9",
	// 'DB_NAME': "dinnerdaily",
	'NO_RESOURCE_FOUND' : "No resource found",
	'AUTH_FAIL': "Authentication failed",
	'OOPS_ERROR': "Oops!!! Something went wrong",
	'MISSING_ID_ERROR': "Missing id in request parameter",
	'SUCCESS_MSG': "Data saved successfully",
	'LOGIN_SUCCESS_MSG': "Login successfully",
	'LOGOUT_SUCCESS_MSG': "Logout successfully",
	'SIGNUP_SUCCESS_MSG': "Signup successfully",
	'UPDATE_SUCCESS_MSG': 'Data updated successfully',
	'DELETE_SUCCESS_MSG': 'Data deleted successfully',
	'DUPLICATE_ERROR': "Duplicate value can't be inserted in database",
	'EMAIL_PASS_ERROR': `Email and/or Password can't be blank`,
	'SOCIAL_MANDATORY_FIELDS': `Please provide all mandatory fields`,
	'EMAIL_NOT_EXITS':`Email not register with us`,
	'EMAIL_EXIST': `Email already register with us`,
	'EMAIL_REQUIRED' :`Email can't be blank`,
	'EMAIL_SEND_SUCCESS':`Email sent successfully`,
	'ROLE_USER':`USER`,
	'PASSWORD_ERROR': 'Incorrect Password',
	'PASSWORD_EXPIRED': 'Your password has expired. A password reset email has sent to your registered email.',
	'OLD_PASSWORD':`Old password not matched with database password`,
	'PASSWORD_MISMATCH':`Password does not match the confirm password`,
	'PASSWORD_UPDATE':`Password updated successfully`,
	'MANDATORY_FIELD_ERROR':"Required fields cannot be left blank",
	'INTERNAL_USER_SUCCESS':`User added successfully`,
	'INTERNAL_USER_ERROR':`User already registered with this email`,
	'INTERNAL_USER_PASSWORD':`Login Password`,
	'SOCIAL_ERROR': `Error In Social Sign`,
	'PROVIDER_ERROR':`Social provider can't be blank`,
	'APPLE_ERROR': 'It seems your email is not linked with apple-Id. Please linked your id first, then try to logged in.',
	'DISH_TYPE': 1,
	'SIDE_DISH_TYPE': 2,
	'DISH_STATUS': 3,
	'TRUE': true,
  'FALSE': false,
	'EXPIRATION_DAYS': 14,
	'NUMBER_OF_MENUS': 100,
	'GOOGLE_ACCOUNT': `google`,
	'FACEBOOK_ACCOUNT': `facebook`,
	'APPLE_ACCOUNT': `apple`,
	'PAGE_SIZE': 100,
	'ORDER_BY': 'asc',
	'ORDEY_KEY': 'id',
	'FORGOT_PASSWORD':'Forgot Password',
	'RESET_PASSWORD':'Reset Password',
	'INVITE_FRIEND':`Invite Friends`,
	'ENABLED': 1,
	'DISABLED': 0,
	'GOOGLE_ACCOUNT': `google`,
	'FACEBOOK_ACCOUNT': `facebook`,
	'APPLE_ACCOUNT': `apple`,
	'SUPPORT_FEEDBACK':`Support & Feedback`,
	'USER_INACTIVE_ACCOUNT':`Your account is deactivated`,
	'MESSAGE_REQUIRED':`Message can't be blank`,
	'SUPPORT_EMAIL_SEND_SUCCESS':`Support Email sent successfully`,
	'INVITE_EMAIL_SEND_SUCCESS': 'An invite has been sent successfully!',
	'PLAN_CANCELLED_MSG': 'Your plan has been cancelled successfully.',
	'PLAN_UPDATE_MSG': 'Your plan been changed successfully.',
	'INVALID_FILE_FORMAT': "Unsupported file format",
	'UPLOAD_SUCCESS_MSG': 'File uploaded successfully',
	'ALREADY_SENT_MSG': 'Notification has already been sent to all recipients',
	'NO_STORE_FOUND': 'No nearby store found.',
	'NO_ITEM_SELECTED': 'No item selected from the list to order',
	'PASSWORD_EXIST': 'Same password has already been set',
	'INVALID_LINK': 'Invalid link or link has been expired',
	'NO_SHEET_ERROR': 'The file you are trying to process is empty. Please check the file again.',
	'NO_STORE_MATCH': 'No store matched in database',
	'SALT': 13, // Bcrypt salt
	'NO_DAY_SELECTED': 'No day selected for notification',
	'SOCIAL_CHANGE_PASS_ERROR': 'You have signup with a social login account, so password change is not available.',
	'ONE_DAY_TIMESTAMP': 86400000,
	'RES_OBJ': {
		"STATUS": {
			"SUCCESS": true,
			"FAIL": false
		},
		'CODE': {
			'SUCCESS': 200,
			'FAIL': 400,
			'UNAUTHORIZED': 401,
			'NOT_FOUND': 404
		},
		'MSG': {
			'SUCCESS': 'The request is OK',
			'FAIL': 'Oops!!! Something went wrong',
			'UNAUTHORIZED': 'Invalid User Credentials',
			'NOT_FOUND': 'Requested resource not found'
		}
	},
	'FREE_TRIAL_DAYS': 14,
	'SUBSCRIPTION_STATUS': {
		'EXPIRED': 'Expired',
		'FREE': 'Free',
		'ACTIVE': 'Active'
	},
	'DB_TABLE': {
		'USERS': 'users',
		'STORES': 'stores',
		'STATES': 'states',
		'STATE_STORE_MAPPING': 'statestoremapping',
		'DIET_PLAN_OPTIONS': 'dietplanoptions',
		'USER_DIET_PLAN_OPTIONS': 'userDietPlanOptions',
		'FAVORITES': 'favorites',
		'RECIPES': 'recipes',
		'NOTIFICATION':'notifications',
		'RECIPE_INGREDIENTS': 'recipeingredients',
		'RECIPE_TAGS':'crossrecipetags',
		'INGREDIENTS': 'ingredients',
		'INGREDIENTS_CATEGORY':'ingredientcategories',
		'HASH_TAGS':'hashtags',
		'INGREDIENTS_MEASUREMENTS': 'ingredientmeasurements',
		'USER_WEEK_MENUS': 'userweekmenus',
		'USER_WEEK_DAY_MENUS': 'userweekdaymenus',
		'USER_WEEK_DAY_MENU_ALTERNATIVES': 'userweekdaymenualternatives',
		'NUTRITIONAL_PROFILE': 'nutritionalprofiles',
		'SHOPPING_CATEGORIES': 'shoppingcategories',
		'SHOPPING_LISTS': 'shoppinglists',
		'SHOPPING_LIST_ITEMS': 'shoppinglistitems',
		'RECIPE_SIDE_COMBINATIONS':'recipesidecombinations',
		'RECIPE_SIDE_ITEMS':'recipesideitems',
		'CROSS_RECIPE_SIDE_ITEM_TAGS':'crossrecipesideitemtags',
		'PRICES': 'prices',
		'BONUS_CONTENT': 'bonuscontent',
		'UPLOAD_CONTENT': 'uploadcontent',
		'SUBSCRIPTION_PLAN_AND_DOMAINS': 'subscriptionplandomains',
		'MEDIA_MEDIA': 'media__media',
		'NEW_BALANCE_RULE_SETS': 'newbalancerulesets',
		'NEW_RESTRICTION_RULE_SETS': 'newrestrictionrulesets',
		'RECIPE_NOT_USED_SCORE': 'recipeNotUsedScore'
	},
	'DB_VIEW': {
		'SHOPPING_LIST_ITEMS_VIEW': 'shopping_list_items_view',
		'RECIPE_INGREDIENTS_VIEW': 'recipe_ingredients_view'
	},
	'STRIPE_EVENT_TYPE': {
		'PAYMENT_INTENT_SUCCEEDED': 'payment_intent.succeeded',
		'PAYMENT_INTENT_FAILED': 'payment_intent.payment_failed',
		'INVOICE_PAYMENT_SUCCEEDED': 'invoice.payment_succeeded',
		'INVOICE_PAYMENT_FAILED': 'invoice.payment_failed',
  },
	'SEASONAL_RULES': {
		'COOL WEATHER': '10 Sep - 31 May',
		'WINTER': '15 Nov - 30 Mar',
		'SUMMER': '15 May - 30 Sep'
	},
	'RULE_KEY': {
		'MAIN_DISH_RULES': 'mainDishRules',
		'SIDE_DISH_RULES': 'sideDishRules',
		'MAIN_AND_SIDE_DISH_RULES': 'mainAndSideDishRules',
		'MEAL_RULES': 'mealRules'
	},
	'RULE_TYPE': {
		'INGREDIENT_CATEGORY': 'ingredientCategory',
		'RECIPE_TAG': 'recipeTag',
		'INGREDIENT_TAG': 'ingredientTag',
		'INGREDIENT': 'ingredient',
		'COOKING_TYPE': 'cookingType',
		'MATCH_ANY': 'matchAny',
		'MATCH_ALL': 'matchAll',
		'SATURATED_FAT': 'saturatedFat',
		'SODIUM': 'sodium'
	}
}