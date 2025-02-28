import { BASE_URL } from "@/constants/baseUrl";
import axios from "axios";
import { createApi } from "./api";

export const axiosServer = axios.create({
    baseURL: BASE_URL
})

export const SERVER_API = createApi(axiosServer)