import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { matchProtocols } from '../helpers/test-data';

describe('Matches and Protocols E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let lightMatches: any[] = [];
  let hardMatches: any[] = [];

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

    // Сначала формируем группы и генерируем расписание
    await request(app.getHttpServer())
      .post('/api/admin/groups/light')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ groupsCount: 1 })
      .catch(() => console.warn('Groups for light already configured'));

    await request(app.getHttpServer())
      .post('/api/admin/groups/hard')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ groupsCount: 1 })
      .catch(() => console.warn('Groups for hard already configured'));

    await request(app.getHttpServer())
      .post('/api/schedule/generate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ overwrite: true })
      .catch(() => console.warn('Schedule generation failed'));

    // Получаем расписание
    const scheduleRes = await request(app.getHttpServer())
      .get('/api/schedule');

    lightMatches = scheduleRes.body.filter((m: any) => m.division === 'light');
    hardMatches = scheduleRes.body.filter((m: any) => m.division === 'hard');
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  describe('1. Просмотр матчей пользователем', () => {
    it('should get all matches', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/matches');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);

    it('should get matches by division', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/matches?division=light');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);
  });

  describe('2. Ввод результатов матчей администратором', () => {
    it('should input protocol for light division matches', async () => {
      if (lightMatches.length === 0) {
        console.warn('No light matches to input protocol');
        return;
      }

      for (let i = 0; i < Math.min(lightMatches.length, 3); i++) {
        const protocol = matchProtocols[i % matchProtocols.length];
        const sets = protocol.sets.map((s: any) => ({ homePoints: s.home, awayPoints: s.away }));

        const res = await request(app.getHttpServer())
          .post(`/api/admin/matches/${lightMatches[i].id}/protocol`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            sets,
            mvpHomeId: null,
            mvpAwayId: null,
            refereeRatingHome: 5,
            refereeRatingAway: 4,
          });
        expect(res.status).toBe(201);
      }
    }, 60000);

    it('should input protocol for hard division matches', async () => {
      if (hardMatches.length === 0) {
        console.warn('No hard matches to input protocol');
        return;
      }

      for (let i = 0; i < Math.min(hardMatches.length, 3); i++) {
        const protocol = matchProtocols[(i + 5) % matchProtocols.length];
        const sets = protocol.sets.map((s: any) => ({ homePoints: s.home, awayPoints: s.away }));

        const res = await request(app.getHttpServer())
          .post(`/api/admin/matches/${hardMatches[i].id}/protocol`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            sets,
            mvpHomeId: null,
            mvpAwayId: null,
            refereeRatingHome: 5,
            refereeRatingAway: 5,
          });
        expect(res.status).toBe(201);
      }
    }, 60000);
  });

  describe('3. Просмотр турнирной таблицы после матчей', () => {
    it('should get standings for light division', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/standings/light');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);

    it('should get standings for hard division', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/standings/hard');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);
  });
});