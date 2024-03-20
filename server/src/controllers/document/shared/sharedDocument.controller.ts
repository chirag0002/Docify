import { Request, Response } from "express";
import { Permission, PrismaClient } from "@prisma/client";
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

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(404).json({ message: "user not exists" })
        }

        const sharedUser = await prisma.documentUser.findFirst({
            where: {
                userId: user.id,
                documentId: id
            }
        })

        if(sharedUser){
            if(sharedUser.permission === permission){
                return res.status(403).json({ message: `you already shared this document with user with ${permission} access`  })
            } else {
                await prisma.documentUser.update({
                    where: {
                        id: sharedUser.id,
                        userId: user.id,
                        documentId: id
                    },
                    data: {
                        permission: permission
                    }
                })

                const mail = {
                    from: document.user.email,
                    to: user.email,
                    subject: `${document.user.name} shared a document with you with ${permission} access`,
                    text: `Hi ${user.name}, You can access the document here: ${process.env.LINK}/document/${id}`
                }
        
                await sendMail(mail)

                return res.status(200).json({
                    message: `document shared with ${permission} access`
                })
            }
        }

        await prisma.documentUser.create({
            data: {
                userId: user.id,
                documentId: id,
                permission: permission
            }
        })

        const mail = {
            from: document.user.email,
            to: user.email,
            subject: `${document.user.name} shared a document with you with ${permission} access`,
            text: `Hi ${user.name}, You can access the document here: ${process.env.LINK}/document/${id}`
        }

        await sendMail(mail)

        return res.status(200).json({ message: `document shared with ${permission} access` })
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const deleteShareDocument = async (req: Request, res: Response) => {
    const { documentId, userId } = req.params
    const ownerId = req.user.id


    try {
        const document = await prisma.document.findUnique({
            where: {
                id: Number(documentId),
                userId: ownerId
            }
        })

        if (!document) {
            return res.status(404).json({ message: "you are not authorised" })
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

        return res.status(200).json({ message: "user removed" })
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const checkPermissions = async (req: Request, res: Response) => {
    const { documentId, userId } = req.params

    try {
        const document = await prisma.document.findUnique({
            where: {
                id: Number(documentId)
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

        return res.status(200).json({ 
            message: "document found",
            permission: documentUser.permission
     })
    } catch (err) {
        return res.status(500).json(err)
    }
}
