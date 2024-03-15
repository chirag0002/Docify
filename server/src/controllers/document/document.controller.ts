import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { documentValidator } from "../../validators/document.validator";

const prisma = new PrismaClient()

export const getDocumentOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const userId = req.user.id

    try {
        const document = await prisma.document.findFirst({
            where: {
                id: id,
                userId: userId
            }
        });

        if (!document) {
            const sharedDocument = await prisma.documentUser.findFirst({
                where: {
                    userId: userId,
                    documentId: id
                },
                select: {
                    document: true
                }
            })

            if (!sharedDocument) {
                return res.status(404).json({ message: "document not found" })
            }

            return res.status(200).json({
                document: sharedDocument.document
            })
        }
        return res.status(200).json({
            document: document
        })
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getDocumentAll = async (req: Request, res: Response) => {
    const userId = req.user.id

    try {
        const documents = await prisma.document.findMany({
            where: {
                userId: userId
            }
        });

        const sharedDocuments = await prisma.documentUser.findMany({
            where: {
                userId: userId
            },
            select: {
                document: true
            }
        })
        const sharedDocumentArray = sharedDocuments.map(item => item.document);

        documents.push(...sharedDocumentArray);

        return res.status(200).json({
            documents: documents
        })
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const updateDocument = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const userId = req.user.id
    const { title, content } = req.body

    const response = documentValidator({ title, content })
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }

    try {
        const document = await prisma.document.findUnique({
            where: {
                id: id,
                userId: userId
            }
        });

        if (!document) {
            const sharedDocument = await prisma.documentUser.findFirst({
                where: {
                    userId: userId,
                    documentId: id
                },
                select: {
                    document: true
                }
            })

            if (!sharedDocument) {
                return res.status(404).json({ message: "document not found" })
            }

            await prisma.document.update({
                where: {
                    id: sharedDocument.document.id
                },
                data: {
                    title: title || sharedDocument.document.title,
                    content: content || sharedDocument.document.content
                }
            })

            return res.status(200).json({
                message: "document updated"
            })
        }
        await prisma.document.update({
            where: {
                id: document.id
            },
            data: {
                title: title || document.title,
                content: content || document.content
            }
        })

        return res.status(200).json({
            message: "document updated"
        })
    } catch (err) {
        return res.status(500).json(err)
    }
}


export const createDocument = async (req: Request, res: Response) => {
    const userId = req.user.id
    if (!userId) return res.status(404)
    try {
        const document = await prisma.document.create({
            data: {
                userId: userId
            }
        });

        return res.status(200).json({
            message: "document created",
            document: document
        })
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const deleteDocument = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const userId = req.user.id

    try {
        await prisma.document.delete({
            where: {
                id: id,
                userId: userId
            }
        })

        return res.status(200).json({
            message: "document deleted"
        })
    } catch (err) {
        console.log(err)
    }
}