import { Request } from "express";
declare global {
    namespace Express{
        interface Request{
            accessToken?: string;
            refreshToken?: string;
            user: {
                id?: number,
                name?: string,
                email?: string,
                password?:string
                isVerified?: boolean,
                verificationToken?: string,
                userRoles?:{ role: { name: string } }[];
            };
        }
    }
}