import { API } from "./api";

export const DocumentService = {
    create: (accessToken: string) => {
        return API.post("/api/v1/document",
            {},
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
    },
    get: (accessToken: string, documentId: number) => {
        return API.get(`/api/v1/document/${documentId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },
    list: (accessToken: string) => {
        return API.get("/api/v1/document", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },
    update: (accessToken: string, payload: {id:string, title?:string, content?:string}) => {
        return API.put(`/api/v1/document/${payload.id}`, payload, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },
    delete: (accessToken: string, documentId?: number) => {
        return API.delete(`/api/v1/document/${documentId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },
};