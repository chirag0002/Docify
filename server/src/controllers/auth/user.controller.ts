import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { genSalt, hash } from "bcrypt";
import { VerifyErrors, sign, verify } from "jsonwebtoken";
import { z } from "zod";
import { sendMail } from "../../smtp-config";

const prisma = new PrismaClient()


export const signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    try {
        const salt = await genSalt()

        const hashedPassword = await hash(password, salt)

        const verificationToken = sign({ email }, process.env.EMAIL_KEY)

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                verificationToken: verificationToken
            }
        })

        await sendMail({
            from: process.env.MAIL,
            to: user.email,
            subject: 'Welcome to Docify, verify your email',
            text: `Hi ${user.name}, Please verify your email by clicking on the following link: https://docify.netlify.app/verify-your-email/${verificationToken}`
        })

        return res.status(201).json({
            message: "user created successfully"
        })

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const signIn = (req: Request, res: Response) => {
    const accessToken = req.accessToken

    const user = req.user

    return res.status(200).json({
        message: "user signed in successfully",
        accessToken: accessToken,
        user: {
            id: user?.id,
            name: user?.name,
        }
    })
}

export const getUser = async (req: Request, res: Response) => {
    const userId = req.params.id

    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId)
        },
        select: {
            id: true,
            name: true,
            email: true,
            isVerified: true
        }
    })
    if (user) {
        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const emailSchema = z.object({
        email: z.string().email({ message: "must be a valid email" })
    })

    try {
        const response = emailSchema.safeParse({ email });
        if (!response.success) {
            return res.status(403).json({ message: response.error.issues });
        }

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(404).json({ message: "user does not exists" })
        }

        const passwordResetToken = sign({ id: user.id, email: user.email }, process.env.PASSWORD_KEY, {
            expiresIn: '2h'
        })

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                passwordResetToken: passwordResetToken
            }
        })

        await sendMail({
            from: process.env.MAIL,
            to: user.email,
            subject: 'Reset your password',
            text: `Hi ${user.name}, Please reset your password by clicking on the following link: https://docify.netlify.app/reset-your-password/${passwordResetToken}`
        })

        return res.status(200).json({
            message: "password reset link sent successfully"
        })
    } catch (err) {
        return res.status(403).json(err)
    }
}

export const confirmPassword = async (req: Request, res: Response) => {
    const { password } = req.body
    const passwordSchema = z.object({
        password: z.string().min(8, { message: "password must be at least 8 characters" })
    })

    const response = passwordSchema.safeParse({ password })
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }

    const salt = await genSalt()
    const hashedPassword = await hash(password, salt)

    const token = req.params.token
    verify(token, process.env.PASSWORD_KEY, async (error: VerifyErrors | null, decoded: any) => {
        if (error) {
            return res.status(403).json({ message: "token is invalid" });
        }
        try {
            if (!decoded) {
                return res.status(403).json({ message: "decoded token is invalid" });
            }

            await prisma.user.update({
                where: {
                    id: decoded.id,
                    passwordResetToken: token
                },
                data: {
                    password: hashedPassword
                }
            })

            return res.status(200).json({
                message: "password changed successfully"
            })
        } catch (err) {
            return res.status(403).json(err);
        }
    })
}

export const verifyEmail = async (req: Request, res: Response) => {
    const token = req.params.token

    verify(token, process.env.EMAIL_KEY, async (error: VerifyErrors | null, decoded: any) => {
        if (error) {
            return res.status(403).json({ message: "token is invalid" });
        }
        try {
            if (!decoded) {
                return res.status(403).json({ message: "decoded token is invalid" });
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: decoded.email
                }
            })

            if (!user) {
                return res.status(404).json({ message: "user does not exists" })
            }

            if (user.isVerified) {
                return res.status(402).json({ message: "user is already verified" })
            }
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isVerified: true
                }
            })

            return res.status(200).json({
                message: "email verified successfully"
            })
        } catch (err) {
            return res.status(403).json(err);
        }
    })
}
