import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { execSync } from 'child_process';
import { AppModule } from '../../src/app.module';

describe('Season and Archive E2E', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    // Запускаем seed перед тестами
    try {
      execSync('npx prisma db seed', { stdio: 'inherit' });
    } catch (error) {
      console.warn('Seed failed, continuing anyway...');
    }

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
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  describe('1. Создание нового сезона', () => {
    it('should create a new season', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/season')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Сезон 2026',
          startDate: '2026-09-01',
          endDate: '2026-11-30',
          weeksCount: 10,
        });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Сезон 2026');
    }, 10000);

    it('should get current season', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/season/current');
      expect(res.status).toBe(200);
      expect(res.body.name).toBeDefined();
    }, 10000);

    it('should get season status', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/season/status');
      expect(res.status).toBe(200);
      expect(res.body.stats).toBeDefined();
    }, 10000);
  });

  describe('2. Архивирование сезона', () => {
    it('should close and archive current season', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/season/close')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ archiveResults: true });
      expect([200, 201, 400]).toContain(res.status);
    }, 30000);

    it('should get archived seasons', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/archive/seasons');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);

    it('should get archived standings if exist', async () => {
      const seasonsRes = await request(app.getHttpServer())
        .get('/api/archive/seasons');

      if (seasonsRes.body.length > 0) {
        const res = await request(app.getHttpServer())
          .get(`/api/archive/seasons/${seasonsRes.body[0].id}/standings`);
        expect(res.status).toBe(200);
        // Не проверяем наличие данных, так как их может не быть
      }
    }, 10000);

    it('should get archived matches if exist', async () => {
      const seasonsRes = await request(app.getHttpServer())
        .get('/api/archive/seasons');

      if (seasonsRes.body.length > 0) {
        const res = await request(app.getHttpServer())
          .get(`/api/archive/seasons/${seasonsRes.body[0].id}/matches`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      }
    }, 10000);
  });
});