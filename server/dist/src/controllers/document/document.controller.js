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
exports.deleteDocument = exports.createDocument = exports.updateDocument = exports.getDocumentAll = exports.getDocumentOne = void 0;
const client_1 = require("@prisma/client");
const document_validator_1 = require("../../validators/document.validator");
const prisma = new client_1.PrismaClient();
const getDocumentOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const userId = req.user.id;
    try {
        const document = yield prisma.document.findFirst({
            where: {
                id: id,
                userId: userId
            },
            select: {
                id: true,
                title: true,
                content: true,
                userId: true,
                documentUsers: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });
        if (!document) {
            const sharedDocument = yield prisma.documentUser.findFirst({
                where: {
                    userId: userId,
                    documentId: id
                },
                select: {
                    document: {
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            userId: true,
                            documentUsers: {
                                select: {
                                    user: {
                                        select: {
                                            id: true,
                                            email: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            if (!sharedDocument) {
                return res.status(404).json({ message: "document not found" });
            }
            const sharedUsers = sharedDocument.document.documentUsers.map(docUser => docUser.user);
            const response = {
                id: sharedDocument.document.id,
                title: sharedDocument.document.title,
                content: sharedDocument.document.content,
                userId: sharedDocument.document.userId,
                sharedUsers: sharedUsers
            };
            return res.status(200).json({
                document: response
            });
        }
        const sharedUsers = document.documentUsers.map(docUser => docUser.user);
        const response = {
            id: document.id,
            title: document.title,
            content: document.content,
            userId: document.userId,
            sharedUsers: sharedUsers
        };
        return res.status(200).json({
            document: response
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.getDocumentOne = getDocumentOne;
const getDocumentAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const documents = yield prisma.document.findMany({
            where: {
                userId: userId
            }
        });
        const sharedDocuments = yield prisma.documentUser.findMany({
            where: {
                userId: userId
            },
            select: {
                document: true
            }
        });
        const sharedDocumentArray = sharedDocuments.map(item => item.document);
        documents.push(...sharedDocumentArray);
        return res.status(200).json({
            documents: documents
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.getDocumentAll = getDocumentAll;
const updateDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const userId = req.user.id;
    const { title, content } = req.body;
    const response = (0, document_validator_1.documentValidator)({ title, content });
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }
    try {
        const document = yield prisma.document.findUnique({
            where: {
                id: id,
                userId: userId
            }
        });
        if (!document) {
            const sharedDocument = yield prisma.documentUser.findFirst({
                where: {
                    userId: userId,
                    documentId: id
                },
                select: {
                    document: true
                }
            });
            if (!sharedDocument) {
                return res.status(404).json({ message: "document not found" });
            }
            yield prisma.document.update({
                where: {
                    id: sharedDocument.document.id
                },
                data: {
                    title: title || sharedDocument.document.title,
                    content: content || sharedDocument.document.content
                }
            });
            return res.status(200).json({
                message: "document updated"
            });
        }
        yield prisma.document.update({
            where: {
                id: document.id
            },
            data: {
                title: title || document.title,
                content: content || document.content
            }
        });
        return res.status(200).json({
            message: "document updated"
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.updateDocument = updateDocument;
const createDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    if (!userId)
        return res.status(404);
    try {
        const document = yield prisma.document.create({
            data: {
                userId: userId
            }
        });
        return res.status(200).json({
            message: "document created",
            document: document
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.createDocument = createDocument;
const deleteDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const userId = req.user.id;
    try {
        const document = yield prisma.document.findUnique({
            where: {
                id: id,
            }
        });
        if (!document) {
            return res.status(404).json({ message: "ocument not found" });
        }
        if (document.userId != userId) {
            return res.status(404).json({ message: "you are not authorised" });
        }
        yield prisma.document.delete({
            where: {
                id: id
            }
        });
        return res.status(200).json({
            message: "document deleted"
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.deleteDocument = deleteDocument;
