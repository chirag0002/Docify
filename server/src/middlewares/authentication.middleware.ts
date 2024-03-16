import { NextFunction, Request, Response } from "express"
import { userSignInValidator, userSignUpValidator } from "../validators/auth.validator"
import { PrismaClient } from '@prisma/client'
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient()

export const userSignUpAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body

    const response = userSignUpValidator({ name, email, password })
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (user) {
            return res.status(401).json({ message: "User already exists" })
        }

        next()
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const userSignInAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    const response = userSignInValidator({ email, password })
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                isVerified: true,
                verificationToken: true,
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User does not exists" })
        }

        const match = await compare(password, user.password)
        if (!match) {
            return res.status(403).json({ message: "password does not match" })
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "please verify email before signing in" })
        }


        const accessToken = sign({ id: user.id, email: user.email }, process.env.ACCESS_KEY, {
            expiresIn: '24h'
        })

        req.accessToken = accessToken;
        req.user = user

        next()
    } catch (err) {
        return res.status(500).json(err)
    }
}