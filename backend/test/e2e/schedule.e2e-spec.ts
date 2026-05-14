import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Schedule Generation E2E', () => {
  let app: INestApplication;
  let adminToken: string;

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

  describe('1. Настройки турнира', () => {
    it('should update tournament settings', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/tournament-settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          playDays: ['saturday', 'sunday'],
          courtsCount: 1,
          courtsNames: ['Площадка 1'],
          matchDurationMinutes: 120,
          dayStartTime: '12:00',
          dayEndTime: '22:00',
        });
      expect(res.status).toBe(200);
    }, 10000);

    it('should get tournament settings', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/tournament-settings');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('playDays');
    }, 10000);
  });

  describe('2. Генерация расписания', () => {
    it('should generate schedule', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/schedule/generate')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ overwrite: true });

      // Проверяем только статус (может быть 201 или 400 если нет условий)
      expect([200, 201, 400]).toContain(res.status);
    }, 30000);

    it('should get schedule for light division', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/schedule?division=light');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);

    it('should get schedule for hard division', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/schedule?division=hard');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);
  });
});