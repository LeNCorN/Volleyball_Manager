import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Readable } from 'stream';
import { Multer } from 'multer';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost:9000');
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin123');
    this.bucketName = this.configService.get<string>('MINIO_BUCKET', 'volleyball');

    this.minioClient = new Minio.Client({
      endPoint: endpoint.split(':')[0],
      port: parseInt(endpoint.split(':')[1] || '9000'),
      useSSL: false,
      accessKey,
      secretKey,
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName);
      this.logger.log(`Bucket "${this.bucketName}" created successfully`);

      // Устанавливаем публичный доступ для чтения
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
      await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
    } else {
      this.logger.log(`Bucket "${this.bucketName}" already exists`);
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'documents'): Promise<string> {
    const fileName = `${folder}/${Date.now()}_${file.originalname.replace(/\s/g, '_')}`;

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    this.logger.log(`File uploaded: ${fileName}`);
    return fileName;
  }

  async getFileUrl(fileName: string): Promise<string> {
    // URL для скачивания (действителен 1 час)
    return await this.minioClient.presignedGetObject(this.bucketName, fileName, 3600);
  }

  async downloadFile(fileName: string): Promise<Readable> {
    return await this.minioClient.getObject(this.bucketName, fileName);
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, fileName);
    this.logger.log(`File deleted: ${fileName}`);
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucketName, fileName);
      return true;
    } catch {
      return false;
    }
  }
}