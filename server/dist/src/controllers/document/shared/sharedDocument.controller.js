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
exports.checkPermissions = exports.deleteShareDocument = exports.shareDocument = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const smtp_config_1 = require("../../../smtp-config");
const prisma = new client_1.PrismaClient();
const shareDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const userId = req.user.id;
    const { email, permission } = req.body;
    const emailPermissionSchema = zod_1.z.object({
        email: zod_1.z.string().email({ message: "must provide a valid email" }),
        permission: zod_1.z.enum(['VIEW', 'EDIT'])
    });
    const response = emailPermissionSchema.safeParse({ email, permission });
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }
    try {
        const document = yield prisma.document.findUnique({
            where: {
                id: id
            },
            select: {
                userId: true,
                user: true
            }
        });
        if (!document) {
            return res.status(404).json({ message: "document not found" });
        }
        if (document.userId !== userId) {
            return res.status(404).json({ message: "you are not allowed to share this document" });
        }
        const user = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(404).json({ message: "user not exists" });
        }
        const sharedUser = yield prisma.documentUser.findFirst({
            where: {
                userId: user.id,
                documentId: id
            }
        });
        if (sharedUser) {
            if (sharedUser.permission === permission) {
                return res.status(403).json({ message: `you already shared this document with user with ${permission} access` });
            }
            else {
                yield prisma.documentUser.update({
                    where: {
                        id: sharedUser.id,
                        userId: user.id,
                        documentId: id
                    },
                    data: {
                        permission: permission
                    }
                });
                const mail = {
                    from: document.user.email,
                    to: user.email,
                    subject: `${document.user.name} shared a document with you with ${permission} access`,
                    text: `Hi ${user.name}, You can access the document here: https://docify.netlify.app/document/${id}`
                };
                yield (0, smtp_config_1.sendMail)(mail);
                return res.status(200).json({
                    message: `document shared with ${permission} access`
                });
            }
        }
        yield prisma.documentUser.create({
            data: {
                userId: user.id,
                documentId: id,
                permission: permission
            }
        });
        const mail = {
            from: document.user.email,
            to: user.email,
            subject: `${document.user.name} shared a document with you with ${permission} access`,
            text: `Hi ${user.name}, You can access the document here: https://docify.netlify.app/document/${id}`
        };
        yield (0, smtp_config_1.sendMail)(mail);
        return res.status(200).json({ message: `document shared with ${permission} access` });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.shareDocument = shareDocument;
const deleteShareDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentId, userId } = req.params;
    const ownerId = req.user.id;
    try {
        const document = yield prisma.document.findUnique({
            where: {
                id: Number(documentId),
                userId: ownerId
            }
        });
        if (!document) {
            return res.status(404).json({ message: "you are not authorised" });
        }
        const documentUser = yield prisma.documentUser.findFirst({
            where: {
                userId: Number(userId),
                documentId: Number(documentId)
            }
        });
        if (!documentUser) {
            return res.status(404).json({ message: "document user not found" });
        }
        yield prisma.documentUser.delete({
            where: {
                id: documentUser.id
            }
        });
        return res.status(200).json({ message: "user removed" });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.deleteShareDocument = deleteShareDocument;
const checkPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentId, userId } = req.params;
    try {
        const document = yield prisma.document.findUnique({
            where: {
                id: Number(documentId)
            }
        });
        if (!document) {
            return res.status(404).json({ message: "document not found" });
        }
        const documentUser = yield prisma.documentUser.findFirst({
            where: {
                userId: Number(userId),
                documentId: Number(documentId)
            }
        });
        if (!documentUser) {
            return res.status(404).json({ message: "document user not found" });
        }
        return res.status(200).json({
            message: "document found",
            permission: documentUser.permission
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.checkPermissions = checkPermissions;
