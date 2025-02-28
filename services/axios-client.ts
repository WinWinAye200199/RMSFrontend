import { BASE_URL } from "@/constants/baseUrl";
import axios from "axios";
import { createApi, setApiToken } from "./api";
import { getJwtClient } from "./getJwtClient";

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'
    }
})

const { jwt } = getJwtClient();

if (jwt && jwt?.accessToken) {
    setApiToken({
        apiInstance: axiosClient,
        token: jwt?.accessToken
    })
}

export const CLIENT_API = createApi(axiosClient);