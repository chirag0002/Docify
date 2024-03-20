import axios from "axios"

const BASE_URL = 'https://docify-sh78.onrender.com'

export const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})
