import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../redis/redis.service';
import { MinioService } from '../storage/minio.service';
import { UploadDocumentDto, DocumentCategory } from '../dto/upload-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { Multer } from 'multer';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly minioService: MinioService,
  ) {}

  async uploadDocument(
    file: Express.Multer.File,
    dto: UploadDocumentDto,
    adminId: string,
  ) {
    // Валидация файла
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Допустимы только PDF файлы');
    }

    if (file.size > 10 * 1024 * 1024) { // 10 MB
      throw new BadRequestException('Максимальный размер файла 10 MB');
    }

    // Загрузка файла в MinIO
    const fileUrl = await this.minioService.uploadFile(file, 'documents');

    // Сохранение информации в БД
    const document = await this.prisma.document.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        fileUrl,
        fileSize: file.size,
        isPublished: true,
        uploadedById: adminId,
      },
    });

    // Инвалидация кэша
    await this.invalidateCache();

    this.logger.log(`Document uploaded: ${dto.title} (${file.size} bytes)`);
    return document;
  }

  async getAllDocuments(category?: DocumentCategory) {
    const cacheKey = category ? `documents:${category}` : 'documents:all';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: any = { isPublished: true };
    if (category) {
      where.category = category;
    }

    const documents = await this.prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: { id: true, username: true },
        },
      },
    });

    // Добавляем временные ссылки для скачивания
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => ({
        ...doc,
        downloadUrl: await this.minioService.getFileUrl(doc.fileUrl),
      })),
    );

    await this.redis.set(cacheKey, documentsWithUrls, 3600); // 1 час
    return documentsWithUrls;
  }

  async getDocumentById(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, username: true },
        },
      },
    });

    if (!document) {
      throw new NotFoundException(`Документ с ID ${id} не найден`);
    }

    return document;
  }

  async downloadDocument(id: string): Promise<{ stream: any; fileName: string; contentType: string }> {
    const document = await this.getDocumentById(id);

    // Увеличиваем счётчик скачиваний
    await this.prisma.document.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    const stream = await this.minioService.downloadFile(document.fileUrl);
    const fileName = document.title.replace(/\s/g, '_') + '.pdf';

    return {
      stream,
      fileName,
      contentType: 'application/pdf',
    };
  }

  async updateDocument(id: string, dto: UpdateDocumentDto, adminId: string) {
    const document = await this.getDocumentById(id);

    const updated = await this.prisma.document.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        isPublished: dto.isPublished,
      },
    });

    await this.invalidateCache();
    this.logger.log(`Document updated: ${updated.title}`);
    return updated;
  }

  async deleteDocument(id: string) {
    const document = await this.getDocumentById(id);

    // Удаляем файл из MinIO
    await this.minioService.deleteFile(document.fileUrl);

    // Удаляем запись из БД
    await this.prisma.document.delete({ where: { id } });

    await this.invalidateCache();
    this.logger.log(`Document deleted: ${document.title}`);
    return { message: `Документ "${document.title}" успешно удалён` };
  }

  async getCategories() {
    const categories = [
      { value: 'regulations', label: 'Регламенты', icon: '📋' },
      { value: 'volleyball_rules', label: 'Правила волейбола', icon: '🏐' },
      { value: 'referee_rules', label: 'Правила судейства', icon: '⚖️' },
      { value: 'other', label: 'Другое', icon: '📄' },
    ];
    return categories;
  }

  private async invalidateCache() {
    await this.redis.del('documents:all');
    await this.redis.invalidate('documents:*');
  }
}