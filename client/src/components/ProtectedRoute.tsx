import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoutes = () => {
    const token = sessionStorage.getItem('token')
    
    return (
        token ? <Outlet /> : <Navigate  to="/signin"/> 
    )
    
}

export const DefendingRoutes = () => {
    const token = sessionStorage.getItem('token')
    
    return (
        (!token)? <Outlet /> : <Navigate  to="/"/> 
    )
}