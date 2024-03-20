"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const documentSchema = zod_1.default.object({
    title: zod_1.default.string().min(3, { message: "must be atleast of 3 charachters" }).max(25, { message: "must be atmost 25 characters" }).optional(),
    content: zod_1.default.string().optional()
});
const documentValidator = ({ title, content }) => {
    const response = documentSchema.safeParse({ title, content });
    return response;
};
exports.documentValidator = documentValidator;
