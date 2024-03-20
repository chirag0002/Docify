"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.confirmPassword = exports.resetPassword = exports.getUser = exports.signIn = exports.signUp = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const zod_1 = require("zod");
const smtp_config_1 = require("../../smtp-config");
const prisma = new client_1.PrismaClient();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const salt = yield (0, bcrypt_1.genSalt)();
        const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
        const verificationToken = (0, jsonwebtoken_1.sign)({ email }, process.env.EMAIL_KEY);
        const user = yield prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                verificationToken: verificationToken
            }
        });
        yield (0, smtp_config_1.sendMail)({
            from: process.env.MAIL,
            to: user.email,
            subject: 'Welcome to Docify, verify your email',
            text: `Hi ${user.name}, Please verify your email by clicking on the following link: ${process.env.LINK}/verify-your-email/${verificationToken}`
        });
        return res.status(201).json({
            message: "user created successfully"
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.signUp = signUp;
const signIn = (req, res) => {
    const accessToken = req.accessToken;
    const user = req.user;
    return res.status(200).json({
        message: "user signed in successfully",
        accessToken: accessToken,
        user: {
            id: user === null || user === void 0 ? void 0 : user.id,
            name: user === null || user === void 0 ? void 0 : user.name,
        }
    });
};
exports.signIn = signIn;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield prisma.user.findUnique({
        where: {
            id: Number(userId)
        },
        select: {
            id: true,
            name: true,
            email: true,
            isVerified: true
        }
    });
    if (user) {
        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
});
exports.getUser = getUser;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const emailSchema = zod_1.z.object({
        email: zod_1.z.string().email({ message: "must be a valid email" })
    });
    try {
        const response = emailSchema.safeParse({ email });
        if (!response.success) {
            return res.status(403).json({ message: response.error.issues });
        }
        const user = yield prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(404).json({ message: "user does not exists" });
        }
        const passwordResetToken = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, process.env.PASSWORD_KEY, {
            expiresIn: '2h'
        });
        yield prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                passwordResetToken: passwordResetToken
            }
        });
        yield (0, smtp_config_1.sendMail)({
            from: process.env.MAIL,
            to: user.email,
            subject: 'Reset your password',
            text: `Hi ${user.name}, Please reset your password by clicking on the following link: ${process.env.LINK}/reset-your-password/${passwordResetToken}`
        });
        return res.status(200).json({
            message: "password reset link sent successfully"
        });
    }
    catch (err) {
        return res.status(403).json(err);
    }
});
exports.resetPassword = resetPassword;
const confirmPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const passwordSchema = zod_1.z.object({
        password: zod_1.z.string().min(8, { message: "password must be at least 8 characters" })
    });
    const response = passwordSchema.safeParse({ password });
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }
    const salt = yield (0, bcrypt_1.genSalt)();
    const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
    const token = req.params.token;
    (0, jsonwebtoken_1.verify)(token, process.env.PASSWORD_KEY, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return res.status(403).json({ message: "token is invalid" });
        }
        try {
            if (!decoded) {
                return res.status(403).json({ message: "decoded token is invalid" });
            }
            yield prisma.user.update({
                where: {
                    id: decoded.id,
                    passwordResetToken: token
                },
                data: {
                    password: hashedPassword
                }
            });
            return res.status(200).json({
                message: "password changed successfully"
            });
        }
        catch (err) {
            return res.status(403).json(err);
        }
    }));
});
exports.confirmPassword = confirmPassword;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    (0, jsonwebtoken_1.verify)(token, process.env.EMAIL_KEY, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return res.status(403).json({ message: "token is invalid" });
        }
        try {
            if (!decoded) {
                return res.status(403).json({ message: "decoded token is invalid" });
            }
            const user = yield prisma.user.findUnique({
                where: {
                    email: decoded.email
                }
            });
            if (!user) {
                return res.status(404).json({ message: "user does not exists" });
            }
            if (user.isVerified) {
                return res.status(402).json({ message: "user is already verified" });
            }
            yield prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isVerified: true
                }
            });
            return res.status(200).json({
                message: "email verified successfully"
            });
        }
        catch (err) {
            return res.status(403).json(err);
        }
    }));
});
exports.verifyEmail = verifyEmail;
