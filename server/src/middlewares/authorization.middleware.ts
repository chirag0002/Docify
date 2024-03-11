import { NextFunction, Request, Response } from "express";
import { VerifyErrors, verify } from "jsonwebtoken";

export const userAuthorization = async(req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]
    if(!token) {
        return res.status(401).json({ message: "invalid token" })
    }
    
    verify(token, "accesstokenkey",(err:VerifyErrors|null, decoded:any) => {
        if(err) {
            return res.status(500).json({ message: "invalid token" })
        }
        try{
            if(!decoded) {
                return res.status(401).json({ message: "invalid token" })
            }
            req.user = {id:decoded.id, email:decoded.email, userRoles:decoded.roles}
            next()
        }catch(err) {
            return res.status(500).json(err)
        }
    })
}