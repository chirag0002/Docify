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
exports.userSignInAuthentication = exports.userSignUpAuthentication = void 0;
const auth_validator_1 = require("../validators/auth.validator");
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma = new client_1.PrismaClient();
const userSignUpAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const response = (0, auth_validator_1.userSignUpValidator)({ name, email, password });
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }
    try {
        const user = yield prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (user) {
            return res.status(401).json({ message: "User already exists" });
        }
        next();
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.userSignUpAuthentication = userSignUpAuthentication;
const userSignInAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const response = (0, auth_validator_1.userSignInValidator)({ email, password });
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }
    try {
        const user = yield prisma.user.findFirst({
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
        });
        if (!user) {
            return res.status(404).json({ message: "User does not exists" });
        }
        const match = yield (0, bcrypt_1.compare)(password, user.password);
        if (!match) {
            return res.status(403).json({ message: "password does not match" });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: "please verify email before signing in" });
        }
        const accessToken = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, process.env.ACCESS_KEY, {
            expiresIn: '24h'
        });
        req.accessToken = accessToken;
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.userSignInAuthentication = userSignInAuthentication;
