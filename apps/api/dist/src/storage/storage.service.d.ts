import { OnModuleInit } from '@nestjs/common';
export declare class StorageService implements OnModuleInit {
    private minioClient;
    private readonly logger;
    private bucketName;
    constructor();
    onModuleInit(): Promise<void>;
    uploadFile(file: Express.Multer.File): Promise<string>;
}
