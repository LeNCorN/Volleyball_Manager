import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { testApplications } from '../helpers/test-data';

describe('Teams and Groups E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let lightTeamIds: string[] = [];
  let hardTeamIds: string[] = [];

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

    // Создаём и подтверждаем заявки для Лайт-лиги
    for (const appData of testApplications.light.approved) {
      const createRes = await request(app.getHttpServer())
        .post('/api/applications')
        .send(appData);

      if (createRes.status === 201) {
        const reviewRes = await request(app.getHttpServer())
          .patch(`/api/applications/${createRes.body.id}/review`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'approved' });

        if (reviewRes.status === 200 && reviewRes.body.team) {
          lightTeamIds.push(reviewRes.body.team.id);
        }
      }
    }

    // Создаём и подтверждаем заявки для Хард-лиги
    for (const appData of testApplications.hard.approved) {
      const createRes = await request(app.getHttpServer())
        .post('/api/applications')
        .send(appData);

      if (createRes.status === 201) {
        const reviewRes = await request(app.getHttpServer())
          .patch(`/api/applications/${createRes.body.id}/review`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'approved' });

        if (reviewRes.status === 200 && reviewRes.body.team) {
          hardTeamIds.push(reviewRes.body.team.id);
        }
      }
    }
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  describe('1. Просмотр команд пользователем', () => {
    it('should get all teams', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/teams');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);

    it('should get light division teams', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/teams?division=light');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);

    it('should get team by id if exists', async () => {
      if (lightTeamIds.length > 0) {
        const res = await request(app.getHttpServer())
          .get(`/api/teams/${lightTeamIds[0]}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(lightTeamIds[0]);
      }
    }, 10000);
  });

  describe('2. Формирование групп администратором', () => {
    it('should configure groups for light division (1 group)', async () => {
      if (lightTeamIds.length >= 2) {
        const res = await request(app.getHttpServer())
          .post('/api/admin/groups/light')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ groupsCount: 1 });
        expect(res.status).toBe(201);
      }
    }, 10000);

    it('should configure groups for hard division (1 group)', async () => {
      if (hardTeamIds.length >= 2) {
        const res = await request(app.getHttpServer())
          .post('/api/admin/groups/hard')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ groupsCount: 1 });
        expect(res.status).toBe(201);
      }
    }, 10000);
  });
});