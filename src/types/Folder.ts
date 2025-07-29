import type { Capture } from "./Capture";

export interface IFolder {
    _id: string;
    name: string;
    description?: string;
    captures: Capture[];
    createdAt: string;
    updatedAt: string;
}