import { PermissionEnum } from "../interfaces/interfaces";
import { API } from "./api";

export const DocumentUserService = {
    create: (accessToken: string, payload: { documentId: number; email: string; permission: PermissionEnum }) => {
        return API.post(`/document/${payload.documentId}/share`, payload, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },

    delete: (accessToken: string, payload: { documentId: number; userId: number }) => {
        return API.delete(`/document/${payload.documentId}/share/${payload.userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },

}