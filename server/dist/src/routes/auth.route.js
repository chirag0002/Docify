"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const express_1 = require("express");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const auth_controller_1 = require("../controllers/auth/auth.controller");
const token_controller_1 = require("../controllers/auth/token.controller");
exports.user = (0, express_1.Router)();
exports.user.post('/signup', authentication_middleware_1.userSignUpAuthentication, auth_controller_1.signUp);
exports.user.post('/signin', authentication_middleware_1.userSignInAuthentication, auth_controller_1.signIn);
exports.user.post('/refresh-token', token_controller_1.refreshToken);
exports.user.post('/logout', authorization_middleware_1.userAuthorisation, auth_controller_1.signOut);
