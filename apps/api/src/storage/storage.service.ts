import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService implements OnModuleInit {
    private minioClient: Minio.Client;
    private readonly logger = new Logger(StorageService.name);
    private bucketName = process.env.MINIO_BUCKET || 'portales-assets';

    constructor() {
        this.minioClient = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT || 'localhost',
            port: parseInt(process.env.MINIO_PORT || '9005', 10),
            useSSL: process.env.MINIO_USE_SSL === 'true',
            accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
            secretKey: process.env.MINIO_SECRET_KEY || 'Admin123pass',
        });
    }

    async onModuleInit() {
        try {
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
                this.logger.log(`Bucket ${this.bucketName} created successfully.`);

                // Set policy allowing public read access
                const policy = {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: { AWS: ['*'] },
                            Action: ['s3:GetObject'],
                            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                        },
                    ],
                };
                await this.minioClient.setBucketPolicy(
                    this.bucketName,
                    JSON.stringify(policy),
                );
                this.logger.log(`Bucket policy set to public read for ${this.bucketName}.`);
            } else {
                this.logger.log(`Bucket ${this.bucketName} already exists.`);
            }
        } catch (error) {
            this.logger.error('Error initializing MinIO bucket', error);
        }
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        // Create an unique safe filename
        const uniqueId = uuidv4();
        const extension = file.originalname.split('.').pop();
        const fileName = `${uniqueId}.${extension}`;

        await this.minioClient.putObject(
            this.bucketName,
            fileName,
            file.buffer,
            file.size,
            { 'Content-Type': file.mimetype },
        );

        // Generate the public URL
        const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
        const host = process.env.MINIO_ENDPOINT || 'localhost';
        const port = process.env.MINIO_PORT || '9005';

        return `${protocol}://${host}:${port}/${this.bucketName}/${fileName}`;
    }
}
