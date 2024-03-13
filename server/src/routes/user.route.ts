import { Router } from "express";
import { userSignInAuthentication, userSignUpAuthentication } from "../middlewares/authentication.middleware";
import { userAuthorization } from "../middlewares/authorization.middleware";
import { signOut, signIn, signUp, getUser, resetPassword, refreshToken, confirmPassword, verifyEmail } from "../controllers/auth/user.controller";

export const router = Router()

router.post('/signup', userSignUpAuthentication, signUp)
router.post('/signin', userSignInAuthentication, signIn)
router.post('/logout', userAuthorization, signOut)
router.get('/:id', userAuthorization, getUser)
router.post('/reset-password', resetPassword)
router.put('/password/:token', confirmPassword)
router.put('/verify-email/:token', verifyEmail)
router.post('/refresh-token', refreshToken)
