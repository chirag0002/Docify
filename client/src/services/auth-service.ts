import { API } from "./api"

export const AuthService = {
    signin: (payload:{email:string, password:string}) => {
        return API.post('/api/v1/user/signin', payload)
    },
    signup: (payload:{name?:string, email:string, password:string}) => {
        return API.post('/api/v1/user/signup', payload)
    },
    logout: (accessToken:string) => {
        return API.delete('/api/v1/user/logout', {
            headers : { Authorization: `Bearer ${accessToken}` }
        })
    },
    verifyEmail: (token?:string) => {
        return API.put(`/api/v1/user/verify-email/${token}`)
    },
    resetPassword: (payload:{email:string}) => {
        return API.post('/api/v1/user/reset-password', payload)
    },
    confirmPassword: (payload:{password:string}, token?:string ) => {
        return API.put(`/api/v1/user/password/${token}`, payload)    
    },
    getUser: (id:string, token:string) => {
        return API.get(`/api/v1/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
    }
}