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
exports.userSignOut = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const userSignOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "token is required" });
    }
    (0, jsonwebtoken_1.verify)(token, "accesstokenkey", (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: "invalid token" });
        }
        try {
            if (!decoded) {
                return res.status(401).json({ message: "invalid token" });
            }
            req.user = { id: decoded.id, email: decoded.email, userRoles: decoded.roles };
            next();
        }
        catch (err) {
            return res.status(500).json(err);
        }
    });
});
exports.userSignOut = userSignOut;
