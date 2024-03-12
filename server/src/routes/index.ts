import { Router } from "express";
import { router as userRouter } from "./user.route";
import { router as documentRouter } from "./document.route";

export const router = Router()

router.use('/user', userRouter)
router.use('/document', documentRouter)