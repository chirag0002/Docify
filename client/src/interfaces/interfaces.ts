import { ChangeEvent } from "react";

export interface LabeledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

export interface DocumentInterface {
    id: number;
    title: string;
    content: string;
    userId: number;
    users: DocumentUserInterface[];
}

export enum PermissionEnum {
    VIEW = 'VIEW',
    EDIT = 'EDIT'
}

export interface DocumentUserInterface {
    permission: PermissionEnum;
    userId: number;
    documentId: number;
    user: {
        email: string;
    }
}

export interface UserInterface {
    name?: string;
    email: string;
    password: string;
}