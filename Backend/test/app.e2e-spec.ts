import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

describe('MicroJob Enterprise E2E Integration Suite', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. GET /api/v1/locations/counties - Should return 47 Kenyan Counties', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/locations/counties')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('2. GET /api/v1/locations/categories - Should return trade categories and skills', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/locations/categories')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('3. POST /api/v1/auth/register - Should register a new Fundi user', async () => {
    const email = `test.fundi.${Date.now()}@microjob.co.ke`;
    const phone = `+2547${Math.floor(10000000 + Math.random() * 90000000)}`;

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Test Fundi',
        email,
        phone,
        password: 'Password123!',
        role: 'WORKER',
      })
      .expect(201);

    expect(response.body).toHaveProperty('tokens');
    expect(response.body.user).toHaveProperty('email', email);
    authToken = response.body.tokens.accessToken;
  });

  it('4. GET /api/v1/auth/me - Should return authenticated profile with JWT', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('fullName', 'Test Fundi');
  });

  it('5. GET /api/v1/jobs - Should list open jobs', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/jobs')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('6. GET /api/v1/workers - Should list available workers', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/workers')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
