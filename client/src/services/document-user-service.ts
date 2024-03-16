import { API } from "./api";

export const DocumentUserService = {
    create: (accessToken: string, payload: { documentId?: number; email: string; permission: string }) => {
        return API.post(`/api/v1/document/${payload.documentId}/share`, payload, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },

    delete: (accessToken: string, payload: { documentId: number; userId: number }) => {
        return API.delete(`/api/v1/document/${payload.documentId}/share/${payload.userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },

    check: (accessToken: string, payload: { documentId: string; userId: string }) => {
        return API.get(`/api/v1/document/${payload.documentId}/permission/${payload.userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    }

}