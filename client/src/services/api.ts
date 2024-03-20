import axios from "axios"

const BASE_URL = 'https://docify-sh78.onrender.com'
// const BASE_URL = 'http://localhost:5173'


export const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})
