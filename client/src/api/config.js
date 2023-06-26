// Base Url for api requests
export const BASE_URL = process.env.REACT_APP_SOURCE_URL;

// successStatusCodes
export const successStatusCode = [200, 201, 202];

export const APP_JSON_HEADER = async (passToken) => {
    const token = JSON.parse(localStorage.getItem("user"))?.token || "";
    const header = {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "69420",
    };
    if (passToken && token) {
        header.Authorization = token;
    }
    return header;
};

export const MULTIPART_HEADER = async (passToken) => {
    const token = JSON.parse(localStorage.getItem("user"))?.token || "";
    const header = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "69420",
    };
    if (passToken && token) {
        header.Authorization = token;
    }
    return header;
};

export const checkLoginUser = () => {
    const token = JSON.parse(localStorage.getItem("user"))?.token || null;
    if (token) return true;
    else return false;
};

export const getLoginId = (cond) => {
    const id = JSON.parse(localStorage.getItem("user"))?.id || null;
    const name = JSON.parse(localStorage.getItem("user"))?.name || null;
    if (cond) return name;
    else return id ? id : false;
};
