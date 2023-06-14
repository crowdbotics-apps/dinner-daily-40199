const rfr = require('rfr');
const multer = require('multer');

const { userAuthentication } = rfr('/shared/jwt');

const stateStoreCtlr = rfr('/controllers/stateStore');
const dietPlanCtlr = rfr('/controllers/dietPlan');
const userCtlr = rfr('/controllers/user');
const adminUserCtlr = rfr('/controllers/admin/user');
const adminIngredientCtlr = rfr('/controllers/admin/ingredient');
const adminRecipeCtlr = rfr('/controllers/admin/recipe');
const adminStoreCtlr = rfr('/controllers/admin/store');
const adminNotificationCtlr = rfr('/controllers/admin/notification');
const adminSubscriptionCtlr = rfr('/controllers/admin/subscription');
const adminSiteContentCtlr = rfr('/controllers/admin/siteContent');
const subscriptionCtlr = rfr('/controllers/subscription');
const homeCtlr = rfr('/controllers/home');
const recipeCtlr = rfr('/controllers/recipe');
const ingredientCtlr = rfr('/controllers/ingredient');
const shoppingCtlr = rfr('/controllers/shopping');
const shoppingOrderCtlr = rfr('/controllers/shoppingOrder');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const publicEndpoint = ['states', 'stores', 'login', 'socialLogin', 'signup', 'forgotPassword', 'resetPassword', 'static/:name', 'webhook'];

let getHandler = {},
postHandler = {},
putHandler = {},
deleteHandler = {};

// All get services
getHandler['/api/v1/states'] = stateStoreCtlr.getStates;
getHandler['/api/v1/stores'] = stateStoreCtlr.getStores;
getHandler['/api/v1/dietPlanOptions'] = dietPlanCtlr.getUserDietPlan;
// getHandler['/api/v1/subscriptionPlan'] = subscriptionCtlr.userSubscriptionPlanStatus;
getHandler['/api/v1/user/subscriptionStatus'] = subscriptionCtlr.userSubscriptionPlanStatus;
getHandler['/api/v1/stripe/subscriptionPlan'] = subscriptionCtlr.getSubscriptionPlanList;
// getHandler['/api/v1/weeklyContent'] = homeCtlr.homeContent;
getHandler['/api/v1/weeklyWins'] = homeCtlr.homeContent;
getHandler['/api/v1/weekMenu'] = recipeCtlr.weekMenu;
getHandler['/api/v1/recipe'] = recipeCtlr.getAllRecipes;
getHandler['/api/v1/ingredient'] = ingredientCtlr.getAllIngredients;
getHandler['/api/v1/shopping/sale'] = shoppingCtlr.shoppingSaleDetail;
getHandler['/api/v1/shopping/categories'] = shoppingCtlr.categories;
getHandler['/api/v1/unitMeasures'] = ingredientCtlr.ingredientUnits;
getHandler['/api/v1/user/recipe'] = recipeCtlr.userRecipes;
getHandler['/api/v1/recipe/search'] = recipeCtlr.searchRecipe;
getHandler['/api/v1/static/:name'] = homeCtlr.static;
getHandler['/api/v1/shopping/ingredient'] = shoppingCtlr.getIngredients;
getHandler['/api/v1/admin/user'] = adminUserCtlr.userList;
getHandler['/api/v1/admin/dashboard'] = adminUserCtlr.adminDasboard;
getHandler['/api/v1/admin/shoppingCategory'] = shoppingCtlr.categories;
getHandler['/api/v1/admin/ingredient'] = adminIngredientCtlr.getAllIngredients;
getHandler['/api/v1/admin/tag'] = adminIngredientCtlr.getAllTags;
getHandler['/api/v1/admin/ingredientCategory'] = adminIngredientCtlr.ingredientCategory;
getHandler['/api/v1/admin/ingredientMeasurement'] = ingredientCtlr.ingredientUnits;
getHandler['/api/v1/admin/recipe'] = adminRecipeCtlr.getAllRecipes;
getHandler['/api/v1/admin/store'] = adminStoreCtlr.getStores;
getHandler['/api/v1/admin/state'] = stateStoreCtlr.getStates;
getHandler['/api/v1/admin/store/:id/special'] = adminStoreCtlr.storeSpecial;
getHandler['/api/v1/admin/notification'] = adminNotificationCtlr.getNotification;
getHandler['/api/v1/bonusContent'] = adminSiteContentCtlr.bonusContent;
getHandler['/api/v1/admin/bonusContent'] = adminSiteContentCtlr.getBonusContent;
getHandler['/api/v1/siteContent'] = adminSiteContentCtlr.uploadContent;
getHandler['/api/v1/admin/uploadContent'] = adminSiteContentCtlr.uploadContent;
getHandler['/api/v1/recipe/:id/image'] = recipeCtlr.recipeImage;
getHandler['/api/v1/shopping/order'] = shoppingOrderCtlr.fetchKrogerProducts;


// All post services
postHandler['/api/v1/login'] = userCtlr.login;
postHandler['/api/v1/logout'] = userCtlr.logout;
postHandler['/api/v1/forgotPassword'] = userCtlr.forgotPassword;
postHandler['/api/v1/resetPassword'] = userCtlr.resetPassword;
postHandler['/api/v1/inviteFriend'] = userCtlr.inviteFriend;
postHandler['/api/v1/socialLogin'] = userCtlr.socialLogin;
postHandler['/api/v1/signup'] = userCtlr.signUp;
postHandler['/api/v1/ingredient'] = ingredientCtlr.addIngredient;
postHandler['/api/v1/dietPlanOptions'] = dietPlanCtlr.dietPlanOptions;
postHandler['/api/v1/recipe'] = recipeCtlr.addRecipe;
postHandler['/api/v1/store'] = stateStoreCtlr.addStore;
postHandler['/api/v1/recipe/:id/favorite'] = recipeCtlr.addFavorite;
postHandler['/api/v1/shopping/ingredient'] = shoppingCtlr.addIngredient;
postHandler['/api/v1/contact'] = userCtlr.supportFeedback;
postHandler['/api/v1/admin/user'] = adminUserCtlr.addUser
postHandler['/api/v1/admin/ingredient'] = ingredientCtlr.addIngredient;
postHandler['/api/v1/admin/ingredientCategory'] = adminIngredientCtlr.addIngredientCategory;
postHandler['/api/v1/admin/store'] = stateStoreCtlr.addStore;
postHandler['/api/v1/stripe/createSubscription'] = subscriptionCtlr.createUserSubscription;
postHandler['/api/v1/webhook'] = subscriptionCtlr.webhook;
postHandler['/api/v1/admin/recipe'] = recipeCtlr.addRecipe;
postHandler['/api/v1/admin/notification'] = adminNotificationCtlr.addNotification;
postHandler['/api/v1/admin/stripe/subscription'] = adminSubscriptionCtlr.createSubscription
postHandler['/api/v1/bonusContent'] = adminSiteContentCtlr.addBonusContent;
postHandler['/api/v1/admin/uploadSpecial'] = adminStoreCtlr.uploadSpecial;

// All put services
putHandler['/api/v1/dietPlanOptions'] = dietPlanCtlr.updateUserDietPlan;
putHandler['/api/v1/changePassword'] = userCtlr.changePassword;
putHandler['/api/v1/user/setting'] = userCtlr.accountSetting;
putHandler['/api/v1/store/:id'] = stateStoreCtlr.updateStore;
putHandler['/api/v1/ingredient/:id'] = ingredientCtlr.updateIngredient;
putHandler['/api/v1/recipe/:id'] = recipeCtlr.updateRecipe;
putHandler['/api/v1/user/weekRecipe/:id'] = recipeCtlr.updateUserWeekRecipe;
putHandler['/api/v1/shopping/ingredient/:id'] = shoppingCtlr.updateIngredient;
putHandler['/api/v1/admin/user/:id'] = adminUserCtlr.updateUser;
putHandler['/api/v1/admin/store/:id'] = stateStoreCtlr.updateStore;
putHandler['/api/v1/admin/ingredient/:id'] = ingredientCtlr.updateIngredient;
putHandler['/api/v1/admin/ingredientCategory/:id'] = adminIngredientCtlr.updateIngredientCategory;
putHandler['/api/v1/user/subscription'] = subscriptionCtlr.updateSubscription;
putHandler['/api/v1/admin/recipe/:id'] = recipeCtlr.updateRecipe;
putHandler['/api/v1/admin/notification/:id'] = adminNotificationCtlr.updateNotification;
putHandler['/api/v1/admin/stripe/subscription/:id'] = adminSubscriptionCtlr.updateSubscription
putHandler['/api/v1/admin/uploadContent/:id'] = adminSiteContentCtlr.updateUploadContent;
putHandler['/api/v1/bonusContent/:id'] = adminSiteContentCtlr.updateBonusContent;
putHandler['/api/v1/admin/store/:id/special'] = adminStoreCtlr.updateStoreSpecial;

// All delete services
deleteHandler['/api/v1/store/:id'] = stateStoreCtlr.deleteStore;
deleteHandler['/api/v1/recipe/:id/favorite'] = recipeCtlr.removeFavorite;
deleteHandler['/api/v1/ingredient/:id'] = ingredientCtlr.deleteIngredient;
deleteHandler['/api/v1/recipe/:id'] = recipeCtlr.deleteRecipe;
deleteHandler['/api/v1/admin/user/:id'] = adminUserCtlr.deleteUser;
deleteHandler['/api/v1/shopping/ingredient/:id'] = shoppingCtlr.deleteIngredient;
deleteHandler['/api/v1/admin/store/:id'] = stateStoreCtlr.deleteStore;
deleteHandler['/api/v1/admin/ingredient/:id'] = ingredientCtlr.deleteIngredient;
deleteHandler['/api/v1/admin/ingredientCategory/:id'] = adminIngredientCtlr.deleteIngredientCategory;
deleteHandler['/api/v1/user/account'] = subscriptionCtlr.deactivateUser;
deleteHandler['/api/v1/admin/recipeIngredient/:id'] = adminRecipeCtlr.deleteRecipeIngredient;
deleteHandler['/api/v1/admin/notification/:id'] = adminNotificationCtlr.deleteNotification;
deleteHandler['/api/v1/admin/stripe/subscription/:id'] = adminSubscriptionCtlr.deleteSubscription
deleteHandler['/api/v1/admin/recipe/:id'] = recipeCtlr.deleteRecipe;

const _isPublicEndpoint = (key) => {
  return !!publicEndpoint.includes(key.split('v1/')[1]);
}

const _bindAllGetRequests = (app) => {
  for (let key in getHandler) {
    if (_isPublicEndpoint(key)) {
      app.get(key, getHandler[key]);
    } else {
      app.get(key, userAuthentication, getHandler[key]);
    }
  }
}

const _bindAllPostRequests = (app) => {
  for (let key in postHandler) {
    if (_isPublicEndpoint(key)) {
      app.post(key, postHandler[key]);
    } else {
      if (key === '/api/v1/bonusContent' || key === '/api/v1/admin/uploadSpecial') {
        app.post(key, userAuthentication, upload.fields([{name: 'content'}, {name: 'icon'}]), postHandler[key]);
      } else {
        app.post(key, userAuthentication, postHandler[key]);
      }
    }
  }
}

const _bindAllPutRequests = (app) => {
  for (let key in putHandler) {
    if (_isPublicEndpoint(key)) {
      app.put(key, putHandler[key]);
    } else {
      if (key === '/api/v1/bonusContent/:id') {
        app.put(key, userAuthentication, upload.fields([{name: 'content'}, {name: 'icon'}]), putHandler[key]);
      } else {
        app.put(key, userAuthentication, putHandler[key]);
      }
    }
  }
}

const _bindAllDeleteRequests = (app) => {
  for (let key in deleteHandler) {
    if (_isPublicEndpoint(key)) {
      app.delete(key, deleteHandler[key]);
    } else {
      app.delete(key, userAuthentication, deleteHandler[key]);
    }
  }
}

const bindAllRequests = (app) => {
  _bindAllGetRequests(app);
  _bindAllPostRequests(app);
  _bindAllPutRequests(app);
  _bindAllDeleteRequests(app);
}

module.exports.bindAllRequests = bindAllRequests;
