import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Players Management E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let playerId: string;

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

    // Получаем ID первого игрока
    const playersRes = await request(app.getHttpServer())
      .get('/api/players');
    if (playersRes.body.length > 0) {
      playerId = playersRes.body[0].id;
    }
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('1. Просмотр игроков', () => {
    it('should get all players', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/players');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);

    it('should get players with filters', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/players?division=light&position=attacker');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 10000);
  });

  describe('2. Повышение уровня игроков администратором', () => {
    it('should update player skill level', async () => {
      if (!playerId) {
        console.warn('No player found for skill update test');
        return;
      }

      const res = await request(app.getHttpServer())
        .patch(`/api/players/${playerId}/skill`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ skillLevel: 'hard_plus' });
      expect(res.status).toBe(200);
      expect(res.body.skillLevel).toBe('hard_plus');
    }, 10000);
  });
});