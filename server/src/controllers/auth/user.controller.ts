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
            text: `Hi ${user.name},Please verify your email by clicking on the following link: https://localhost:3000/verify-email/${verificationToken}`
        })

        return res.status(201).json({
            message: "user created successfully",
            token: user.verificationToken,
            user: {
                id: user.id,
                name: user.name
            }
        })

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const signIn = (req: Request, res: Response) => {
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken

    const user = req.user

    return res.status(200).json({
        message: "user signed in successfully",
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
            id: user?.id,
            name: user?.name,
        }
    })
}

export const signOut = async (req: Request, res: Response) => {
    const id = req.user.id

    await prisma.refreshToken.delete({
        where: {
            userId: id
        }
    })

    return res.status(200).json({
        message: "user signed out successfully"
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
            email: true
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

export const refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body

    if (!token) {
        return res.status(400).json({ message: "token is required" })
    }

    try {
        const valid = await prisma.refreshToken.findFirst({
            where: {
                token: token
            }
        })

        if (!valid) {
            return res.status(403).json({ message: "token is invalid" })
        }

        verify(token, process.env.REFRESH_KEY, async (error: VerifyErrors | null, decoded: any) => {
            if (error) {
                return res.status(403).json({ message: "Token is invalid" });
            }
            try {
                if (!decoded) {
                    return res.status(403).json({ message: "Decoded token is invalid" });
                }
                const accessToken = sign({ id: decoded.id, email: decoded.email }, process.env.ACCESS_KEY, {
                    expiresIn: '24h'
                });
                const refreshToken = sign({ id: decoded.id, email: decoded.email }, process.env.REFRESH_KEY, {
                    expiresIn: '24h'
                });

                await prisma.refreshToken.update({
                    where: { userId: decoded.id },
                    data: {
                        token: refreshToken
                    }
                });
                res.status(200).json({
                    message: "token refreshed successfully",
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
            } catch (err) {
                return res.status(500).json(err)
            }
        });
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const emailSchema = z.string().email({ message: "must be a valid email" });

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

        const passwordResetToken = sign({ id: user.id, email: user.email }, "passwordresettoken", {
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
            text: `Hi ${user.name},Please reset your password by clicking on the following link: https://localhost:3000/reset-password/${passwordResetToken}`
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
    const passwordSchema = z.string().min(8, { message: "password must be at least 8 characters" })

    const response = passwordSchema.safeParse({ password })
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }

    const salt = await genSalt()
    const hashedPassword = await hash(password, salt)

    const token = req.params.token
    verify(token, "passwordresettoken", async (error: VerifyErrors | null, decoded: any) => {
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
                return res.status(403).json({ message: "user is already verified" })
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