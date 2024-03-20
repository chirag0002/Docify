import { Router } from "express";
import { userSignInAuthentication, userSignUpAuthentication } from "../middlewares/authentication.middleware";
import { userAuthorization } from "../middlewares/authorization.middleware";
import { signIn, signUp, getUser, resetPassword, confirmPassword, verifyEmail } from "../controllers/auth/user.controller";

export const router = Router()

router.post('/signup', userSignUpAuthentication, signUp)
router.post('/signin', userSignInAuthentication, signIn)
router.get('/:id', userAuthorization, getUser)
router.post('/reset-password', resetPassword)
router.put('/password/:token', confirmPassword)
router.put('/verify-email/:token', verifyEmail)
