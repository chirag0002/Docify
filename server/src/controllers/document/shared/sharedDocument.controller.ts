import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { sendMail } from "../../../smtp-config";

const prisma = new PrismaClient();

export const shareDocument = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const userId = req.user.id

    const { email, permission } = req.body
    const emailPermissionSchema = z.object({
        email: z.string().email({ message: "must provide a valid email" }),
        permission: z.enum(['VIEW', 'EDIT'])
    })
    const response = emailPermissionSchema.safeParse({ email, permission })
    if (!response.success) {
        return res.status(403).json({ message: response.error.issues });
    }

    try {
        const document = await prisma.document.findUnique({
            where: {
                id: id
            },
            select: {
                userId: true,
                user: true
            }
        })

        if (!document) {
            return res.status(404).json({ message: "document not found" })
        }

        if (document.userId !== userId) {
            return res.status(404).json({ message: "you are not allowed to share this document" })
        }

        const sharedUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!sharedUser) {
            return res.status(404).json({ message: "user not exists" })
        }

        const documentUser = await prisma.documentUser.create({
            data: {
                userId: sharedUser.id,
                documentId: id,
                permission: permission
            }
        })

        const mail = {
            from: document.user.email,
            to: sharedUser.email,
            subject: `${document.user.name} shared a document with you`,
            text: `Hi ${sharedUser.name}, You can access the document here: https://localhost:3000/document/${id}`
        }

        await sendMail(mail)

        return res.status(200).json({ message: "document shared" })
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const deleteShareDocument = async (req: Request, res: Response) => {
    const { documentId, userId } = req.params

    try {
        const document = await prisma.document.findUnique({
            where: {
                id: Number(documentId),
                userId: Number(userId)
            }
        })

        if (!document) {
            return res.status(404).json({ message: "document not found" })
        }

        const documentUser = await prisma.documentUser.findFirst({
            where: {
                userId: Number(userId),
                documentId: Number(documentId)
            }
        })

        if (!documentUser) {
            return res.status(404).json({ message: "document user not found" })
        }

        await prisma.documentUser.delete({
            where: {
                id: documentUser.id
            }
        })

        return res.status(200).json({ message: "document deleted" })
    } catch (err) {
        return res.status(500).json(err)
    }
}