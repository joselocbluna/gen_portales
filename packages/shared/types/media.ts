// packages/shared/types/media.ts

export interface MediaFile {
    id: string;
    filename: string;
    storagePath: string;
    mimeType: string;
    size: number;
    width?: number | null;
    height?: number | null;
    alt?: string | null;
    category?: string | null; // "image", "video", "document"

    variants?: MediaVariants | null;

    companyId: string;
    projectId?: string | null;
    uploadedBy: string;

    createdAt: Date | string;
}

export interface MediaVariants {
    thumbnail?: string;
    webp?: string;
    avif?: string;
    [key: string]: string | undefined;
}
