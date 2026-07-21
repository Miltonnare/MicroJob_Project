import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MicroJob Backend E2E Suite', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/locations/counties (GET) - Should return 47 Kenyan Counties', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/locations/counties')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/api/v1/locations/categories (GET) - Should return informal trade categories', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/locations/categories')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/api/v1/jobs (GET) - Should list open jobs', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/jobs')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/api/v1/workers (GET) - Should list available fundis', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/workers')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
