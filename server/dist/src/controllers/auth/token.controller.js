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
exports.refreshToken = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma = new client_1.PrismaClient();
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: "token is required" });
    }
    try {
        const valid = yield prisma.refreshToken.findFirst({
            where: {
                token: token
            }
        });
        if (!valid) {
            return res.status(403).json({ message: "token is invalid" });
        }
        (0, jsonwebtoken_1.verify)(token, "refreshtokenkey", (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                return res.status(403).json({ message: "Token is invalid" });
            }
            try {
                if (!decoded) {
                    return res.status(403).json({ message: "Decoded token is invalid" });
                }
                const accessToken = (0, jsonwebtoken_1.sign)({ id: decoded.id, email: decoded.email, roles: decoded.roles }, "accesstokenkey", {
                    expiresIn: '24h'
                });
                const refreshToken = (0, jsonwebtoken_1.sign)({ id: decoded.id, email: decoded.email, roles: decoded.roles }, "refreshtokenkey", {
                    expiresIn: '24h'
                });
                yield prisma.refreshToken.update({
                    where: { userId: decoded.id },
                    data: {
                        token: refreshToken
                    }
                });
                res.status(200).json({
                    message: "token refreshed successfully",
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });
            }
            catch (err) {
                return res.status(500).json(err);
            }
        }));
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.refreshToken = refreshToken;
