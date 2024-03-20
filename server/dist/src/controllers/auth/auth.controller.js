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
exports.getUser = exports.signOut = exports.signIn = exports.signUp = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma = new client_1.PrismaClient();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const salt = yield (0, bcrypt_1.genSalt)();
        const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
        const verificationToken = (0, jsonwebtoken_1.sign)({ email }, "emailverificationkey");
        const user = yield prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                verificationToken: verificationToken
            }
        });
        return res.status(201).json({
            message: "user created successfully",
            token: user.verificationToken,
            user: {
                id: user.id,
                name: user.name
            }
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.signUp = signUp;
const signIn = (req, res) => {
    const accessToken = req.accessToken;
    const refreshToken = req.refreshToken;
    const user = req.user;
    return res.status(200).json({
        message: "user signed in successfully",
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
            id: user === null || user === void 0 ? void 0 : user.id,
            name: user === null || user === void 0 ? void 0 : user.name,
        }
    });
};
exports.signIn = signIn;
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    yield prisma.refreshToken.delete({
        where: {
            userId: id
        }
    });
    return res.status(200).json({
        message: "user signed out successfully"
    });
});
exports.signOut = signOut;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.getUser = getUser;
