import axios from "axios";
import {
    APP_JSON_HEADER,
    BASE_URL,
    MULTIPART_HEADER,
    successStatusCode,
} from "./config";

import EndPoints from "./endPoints";

const GET = "GET";
const POST = "POST";
const PUT = "PUT";
const DELETE = "DELETE";
const PATCH = "PATCH";

export async function request(
    endPoint,
    method,
    body,
    passToken = true,
    params = undefined
) {
    let APIURL = BASE_URL + endPoint;
    const header = await APP_JSON_HEADER(passToken);
    return await axios({
        method: method,
        url: APIURL,
        data: body,
        headers: header,
        params: params,
    })
        .then(function (response) {
            if (successStatusCode.includes(response?.status))
                return response?.data;
        })
        .catch((error) => {
            throw error;
        });
}

export async function MultipartRequest(
    endPoint,
    method,
    body,
    passToken = true
) {
    let APIURL = BASE_URL + endPoint;
    const header = await MULTIPART_HEADER(passToken);
    return await axios({
        method: method,
        url: APIURL,
        data: body,
        headers: header,
    })
        .then(function (response) {
            if (successStatusCode.includes(response?.status))
                return response?.data;
        })
        .catch((error) => {
            throw error;
        });
}

export async function login(params) {
    return request(EndPoints.login, POST, params);
}

/* Log out Account */
export async function logout(params) {
    return request(EndPoints.logout, POST);
}

/* CHange password */
export async function changepassword(params, body) {
    return request(EndPoints.changepassword + params + "/", PUT, body);
}

/* Send Feedback */
export async function sendfeedback(params) {
    return request(EndPoints.sendfeedback, POST, params);
}

/* Admin user listing */
export async function getAdminUsers() {
    return request(EndPoints.adminuser, GET);
}

/* Admin user listing */
export async function getNotifications() {
    return request(EndPoints.notification, GET);
}

/* Admin add user */
export async function addAdminUser(params) {
    return request(EndPoints.adminadduser, POST, params);
}

/* Admin edit user */
export async function updateAdminUser(params) {
    return request(`${EndPoints.adminedituser}${params.id}/`, PUT, params);
}

/* Admin delete user */
export async function deleteUser(params) {
    return request(`${EndPoints.admindeleteuser}${params}/`, DELETE);
}

/* Admin Dashboard listing */
export async function adminDashboard() {
    return request(EndPoints.admindashboard, GET, true);
}

/* Admin Ingedients listing */
export async function adminIngredients(params) {
    const { page, pageSize, sortField, sortValue, searchTerm } = params;
    let queryParams = `?page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortValue=${sortValue}`;
    if (searchTerm) queryParams += `&name=${searchTerm}`;
    return request(`${EndPoints.ingedients}${queryParams}`, GET);
}

/* Admin Recipes Listing */
export async function adminRecipes(params) {
    const { page, pageSize, sortField, sortValue } = params;
    const queryParams = `?page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortValue=${sortValue}`;
    return request(`${EndPoints.recipe}${queryParams}`, GET);
}

/* Admin Recipes Listing */
export async function adminStores(params) {
    const { page, pageSize, sortField, sortValue } = params;
    const queryParams = `?page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortValue=${sortValue}`;
    return request(`${EndPoints.store}${queryParams}`, GET);
}

/* Admin Ingedients Category listing */
export async function ingredientCategory() {
    return request(EndPoints.ingedientsCategory, GET);
}

/* Admin Shopping Category listing */
export async function shoppingCategory() {
    return request(EndPoints.shoppingCategory, GET);
}

/* Admin Ingedients Meausurment listing */
export async function ingredientMeausurment() {
    return request(EndPoints.ingredientMeausurment, GET);
}

/* Admin Tags listing */
export async function tags(type) {
    let queryParams;
    if (type) queryParams = `?type=2`;
    else queryParams = `?type=1`;
    return request(`${EndPoints.tag}${queryParams}`, GET);
}

/* Admin Store listing */
export async function states() {
    return request(EndPoints.state, GET);
}

/* Admin Add Ingedients */
export async function addIngredient(params) {
    return request(EndPoints.ingedients, POST, params);
}

/* Admin Remove Ingredients */
export async function deleteIngredient(params) {
    return request(`${EndPoints.ingedients}${params}`, DELETE);
}

/* Admin update Ingredients */
export async function updateIngredient(params, id) {
    return request(`${EndPoints.ingedients}${id}/`, PUT, params);
}

/* Admin Add Stores */
export async function addStores(params) {
    return request(EndPoints.store, POST, params);
}

/* Admin update stores */
export async function updateStores(params, id) {
    return request(`${EndPoints.store}${id}/`, PUT, params);
}

/* Admin Remove Stores */
export async function deleteStore(params) {
    return request(`${EndPoints.store}${params}`, DELETE);
}

/* Admin Add Root Category */
export async function addRootCategory(params) {
    return request(EndPoints.ingedientsCategory, POST, params);
}

/* Admin update Root Category */
export async function updateRootCategory(params, id) {
    return request(`${EndPoints.ingedientsCategory}${id}/`, PUT, params);
}

/* Admin Remove Root Category */
export async function deleteRootCategory(params) {
    return request(`${EndPoints.ingedientsCategory}${params}`, DELETE);
}

/* Admin Add Ingedients */
export async function addRecipe(params) {
    return request(EndPoints.recipe, POST, params);
}

/* Admin Remove Ingredients */
export async function deleteRecipe(params, extraParams) {
    let queryParams = `${params}`;
    if (extraParams) {
        queryParams += `?rscid=${extraParams?.rscid}&rsid=${extraParams?.rsid}`;
    }
    return request(`${EndPoints.recipe}${queryParams}`, DELETE);
}

/* Admin update Ingredients */
export async function updateRecipe(params, id, extraParams) {
    let queryParams = "";
    if (extraParams) {
        queryParams += `?rscid=${extraParams?.rscid}&rsid=${extraParams?.rsid}`;
    }
    return request(`${EndPoints.recipe}${id}/${queryParams}`, PUT, params);
}

/* Admin Delete Recipe Ingredients */
export async function deleteRecipeIngredient(params) {
    return request(`${EndPoints.recipeIngredient}${params}`, DELETE);
}

/* Admin Delete Recipe Ingredients */
export async function deleteRecipeSide(params) {
    return request(`${EndPoints.recipeSide}${params}`, DELETE);
}

/* Admin Add Notification */
export async function addNotification(params) {
    return request(EndPoints.notification, POST, params);
}

/* Admin update Notifications */
export async function updateNotification(params, id) {
    return request(`${EndPoints.notification}/${id}`, PUT, params);
}

/* Admin Remove Notification */
export async function deleteNotification(params) {
    return request(`${EndPoints.notification}/${params}`, DELETE);
}

/* Admin Remove Notification */
export async function getSubscriptions() {
    return request(EndPoints.subscription, GET);
}

/* Admin Add Subscription */
export async function addSubscription(params) {
    return request(EndPoints.subscriptions, POST, params);
}

/* Admin update Subscription */
export async function updateSubscription(params, id) {
    return request(`${EndPoints.subscriptions}${id}/`, PUT, params);
}

/* Admin get Upload Content */
export async function getUploadContent() {
    return request(EndPoints.uploadContent, GET);
}

/* Admin update Upload Content */
export async function updateUploadContent(params, id) {
    return request(`${EndPoints.uploadContent}${id}/`, PUT, params);
}
