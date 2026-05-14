import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Documents Management E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let documentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api');
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = loginRes.body.access_token;
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('1. Загрузка документов администратором', () => {
    it('should upload a PDF document', async () => {
      // Создаём тестовый PDF контент
      const testPdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Test Document) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000059 00000 n \n0000000115 00000 n \n0000000216 00000 n \n0000000277 00000 n \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n360\n%%EOF\n', 'utf-8');

      const res = await request(app.getHttpServer())
        .post('/api/documents/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('title', 'Тестовый документ')
        .field('description', 'Описание тестового документа')
        .field('category', 'regulations')
        .attach('file', testPdfContent, 'test.pdf');

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Тестовый документ');
      documentId = res.body.id;
    }, 30000);
  });

  describe('2. Просмотр документов пользователем', () => {
    it('should get all documents', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/documents');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);

    it('should get document categories', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/documents/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('label');
    }, 10000);

    it('should download document', async () => {
      if (!documentId) {
        console.warn('No document to download');
        return;
      }

      const res = await request(app.getHttpServer())
        .get(`/api/documents/${documentId}/download`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
    }, 10000);
  });

  describe('3. Удаление документов администратором', () => {
    it('should delete document', async () => {
      if (!documentId) {
        console.warn('No document to delete');
        return;
      }

      const res = await request(app.getHttpServer())
        .delete(`/api/documents/${documentId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    }, 10000);
  });
});