"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignInValidator = exports.userSignUpValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const userSignUpSchema = zod_1.default.object({
    name: zod_1.default.string().min(3, { message: "must provide a valid password of atleast 8 charachters" }),
    email: zod_1.default.string().email({ message: "must provide a valid email address" }),
    password: zod_1.default.string().min(8, { message: "must provide a valid password of atleast 8 charachters" })
});
const userSignInSchema = zod_1.default.object({
    email: zod_1.default.string().email({ message: "must provide a valid email address" }),
    password: zod_1.default.string().min(8, { message: "must provide a valid password of atleast 8 charachters" })
});
const userSignUpValidator = ({ name, email, password }) => {
    const resposne = userSignUpSchema.safeParse({ name, email, password });
    return resposne;
};
exports.userSignUpValidator = userSignUpValidator;
const userSignInValidator = ({ email, password }) => {
    const resposne = userSignInSchema.safeParse({ email, password });
    return resposne;
};
exports.userSignInValidator = userSignInValidator;
