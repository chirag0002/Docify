import { Router } from "express";
import { userSignInAuthentication, userSignUpAuthentication } from "../middlewares/authentication.middleware";
import { userAuthorization } from "../middlewares/authorization.middleware";
import { signOut, signIn, signUp, getUser, resetPassword, refreshToken, confirmPassword } from "../controllers/auth/user.controller";

export const user = Router()

user.post('/signup', userSignUpAuthentication, signUp)
user.post('/signin', userSignInAuthentication, signIn)
user.post('/refresh-token', refreshToken)
user.post('/logout', userAuthorization, signOut)
user.get('/:id', userAuthorization, getUser)
user.post('/reset-password', resetPassword)
user.put('/password/:token', confirmPassword)
