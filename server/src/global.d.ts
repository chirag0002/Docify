import { Request } from "express";
declare global {
    namespace Express {
        interface Request {
            accessToken?: string;
            user: {
                id?: number,
                name?: string,
                email?: string,
                password?: string
                isVerified?: boolean,
                verificationToken?: string
            };
        }
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            EMAIL_KEY: string;
            ACCESS_KEY: string;
            PASSWORD_KEY: string;
        }
    }
}
