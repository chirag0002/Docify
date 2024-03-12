import { Router } from "express";
import { userAuthorization } from "../middlewares/authorization.middleware";
import { getDocumentOne, getDocumentAll, updateDocument, createDocument, deleteDocument } from "../controllers/document/document.controller";
import { shareDocument, deleteShareDocument } from "../controllers/document/shared/sharedDocument.controller";

export const router = Router()

router.get('/:id', userAuthorization, getDocumentOne)
router.get('/', userAuthorization, getDocumentAll)
router.post('/', userAuthorization, createDocument)
router.put('/:id', userAuthorization, updateDocument)
router.delete('/:id', userAuthorization, deleteDocument)
router.post('/:id/share', userAuthorization, shareDocument)
router.delete('/:documentId/share/:userId', userAuthorization, deleteShareDocument)