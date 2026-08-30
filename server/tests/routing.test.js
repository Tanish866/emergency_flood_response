const request = require('supertest');
const app = require('../src/app');
const Road = require('../src/models/Road');
const { connectTestDB, clearTestDB, disconnectTestDB } = require('./utils/testDb');
const { ROLES, ROAD_STATUS } = require('../src/utils/constants');

const ORIGIN = [77.4538, 28.6692];
const DESTINATION = [77.4600, 28.6750];

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

const registerAs = async (role, email) => {
  const res = await request(app).post('/api/v1/auth/register').send({
    name: `${role} tester`,
    phone: '9997778888',
    email,
    password: 'StrongPass123',
    role,
  });
  return res.body.data.token;
};

describe('POST /api/v1/routes/safe', () => {
  it('returns a safe route when all nearby roads are open', async () => {
    const token = await registerAs(ROLES.USER, 'router1@example.com');
    await Road.create({
      name: 'Open Road',
      geometry: { type: 'LineString', coordinates: [ORIGIN, DESTINATION] },
      status: ROAD_STATUS.OPEN,
    });

    const res = await request(app)
      .post('/api/v1/routes/safe')
      .set('Authorization', `Bearer ${token}`)
      .send({ origin: ORIGIN, destination: DESTINATION });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.isSafe).toBe(true);
  });

  it('flags the route unsafe when a nearby road is blocked', async () => {
    const token = await registerAs(ROLES.USER, 'router2@example.com');
    await Road.create({
      name: 'Blocked Road',
      geometry: { type: 'LineString', coordinates: [ORIGIN, DESTINATION] },
      status: ROAD_STATUS.BLOCKED,
    });

    const res = await request(app)
      .post('/api/v1/routes/safe')
      .set('Authorization', `Bearer ${token}`)
      .send({ origin: ORIGIN, destination: DESTINATION });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.isSafe).toBe(false);
  });

  it('flags the route unsafe when a nearby road is closed', async () => {
    const token = await registerAs(ROLES.USER, 'router3@example.com');
    await Road.create({
      name: 'Closed Road',
      geometry: { type: 'LineString', coordinates: [ORIGIN, DESTINATION] },
      status: ROAD_STATUS.CLOSED,
    });

    const res = await request(app)
      .post('/api/v1/routes/safe')
      .set('Authorization', `Bearer ${token}`)
      .send({ origin: ORIGIN, destination: DESTINATION });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.isSafe).toBe(false);
  });

  it('applies a risk multiplier for high-risk roads without marking them unsafe', async () => {
    const token = await registerAs(ROLES.USER, 'router4@example.com');
    await Road.create({
      name: 'High Risk Road',
      geometry: { type: 'LineString', coordinates: [ORIGIN, DESTINATION] },
      status: ROAD_STATUS.HIGH_RISK,
      riskPenalty: 5,
    });

    const res = await request(app)
      .post('/api/v1/routes/safe')
      .set('Authorization', `Bearer ${token}`)
      .send({ origin: ORIGIN, destination: DESTINATION });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.isSafe).toBe(true);
    expect(res.body.data.route.totalCost).toBeGreaterThan(0);
  });

  it('rejects invalid coordinates', async () => {
    const token = await registerAs(ROLES.USER, 'router5@example.com');

    const res = await request(app)
      .post('/api/v1/routes/safe')
      .set('Authorization', `Bearer ${token}`)
      .send({ origin: [200, 200], destination: DESTINATION });

    expect(res.statusCode).toBe(400);
  });

  it('reports no route available when no roads are known nearby', async () => {
    const token = await registerAs(ROLES.USER, 'router6@example.com');

    const res = await request(app)
      .post('/api/v1/routes/safe')
      .set('Authorization', `Bearer ${token}`)
      .send({ origin: ORIGIN, destination: DESTINATION });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.route).toBeNull();
    expect(res.body.data.isSafe).toBe(false);
  });
});

describe('POST /api/v1/routes/recalculate', () => {
  it('recalculates after a road status change', async () => {
    const token = await registerAs(ROLES.USER, 'router7@example.com');
    const road = await Road.create({
      name: 'Changing Road',
      geometry: { type: 'LineString', coordinates: [ORIGIN, DESTINATION] },
      status: ROAD_STATUS.OPEN,
    });

    const before = await request(app)
      .post('/api/v1/routes/recalculate')
      .set('Authorization', `Bearer ${token}`)
      .send({ origin: ORIGIN, destination: DESTINATION });
    expect(before.body.data.isSafe).toBe(true);

    road.status = ROAD_STATUS.BLOCKED;
    await road.save();

    const after = await request(app)
      .post('/api/v1/routes/recalculate')
      .set('Authorization', `Bearer ${token}`)
      .send({ origin: ORIGIN, destination: DESTINATION });
    expect(after.body.data.isSafe).toBe(false);
  });
});
