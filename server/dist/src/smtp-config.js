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
exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
const transporter = (0, nodemailer_1.createTransport)({
    port: 465,
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    },
    secure: true
});
const sendMail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        transporter.sendMail(mailOptions, (error, emailResponse) => {
            if (error) {
                throw error;
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendMail = sendMail;
