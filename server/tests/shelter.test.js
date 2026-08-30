const request = require('supertest');
const app = require('../src/app');
const Shelter = require('../src/models/Shelter');
const { connectTestDB, clearTestDB, disconnectTestDB } = require('./utils/testDb');
const { SHELTER_STATUS, ROLES } = require('../src/utils/constants');

let token;
const CENTER = [77.4538, 28.6692];

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  const res = await request(app).post('/api/v1/auth/register').send({
    name: 'Shelter Tester',
    phone: '9991112222',
    email: 'sheltertester@example.com',
    password: 'StrongPass123',
    role: ROLES.USER,
  });
  token = res.body.data.token;
});

const authed = (req) => req.set('Authorization', `Bearer ${token}`);

describe('GET /api/v1/shelters', () => {
  it('lists all shelters', async () => {
    await Shelter.create({
      name: 'Shelter A',
      location: { type: 'Point', coordinates: CENTER },
      capacity: 100,
      currentOccupancy: 10,
      status: SHELTER_STATUS.AVAILABLE,
    });

    const res = await authed(request(app).get('/api/v1/shelters'));

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});

describe('GET /api/v1/shelters/:id', () => {
  it('returns a shelter by id', async () => {
    const shelter = await Shelter.create({
      name: 'Shelter B',
      location: { type: 'Point', coordinates: CENTER },
      capacity: 50,
      status: SHELTER_STATUS.AVAILABLE,
    });

    const res = await authed(request(app).get(`/api/v1/shelters/${shelter._id}`));

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Shelter B');
  });

  it('returns 404 for a non-existent shelter id', async () => {
    const fakeId = '64f000000000000000000000';
    const res = await authed(request(app).get(`/api/v1/shelters/${fakeId}`));
    expect(res.statusCode).toBe(404);
  });
});

describe('GET /api/v1/shelters/nearby', () => {
  it('returns shelters near given coordinates', async () => {
    await Shelter.create({
      name: 'Nearby Shelter',
      location: { type: 'Point', coordinates: CENTER },
      capacity: 60,
      status: SHELTER_STATUS.AVAILABLE,
    });

    const res = await authed(
      request(app).get(`/api/v1/shelters/nearby?lng=${CENTER[0]}&lat=${CENTER[1]}`)
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('returns an empty array when nothing is nearby', async () => {
    const res = await authed(
      request(app).get(`/api/v1/shelters/nearby?lng=${CENTER[0]}&lat=${CENTER[1]}&maxDistanceKm=1`)
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('rejects invalid coordinates', async () => {
    const res = await authed(request(app).get('/api/v1/shelters/nearby?lng=abc&lat=xyz'));
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/v1/shelters/recommended', () => {
  it('excludes FULL, CLOSED, and UNSAFE shelters from the recommendation', async () => {
    await Shelter.create([
      { name: 'Full', location: { type: 'Point', coordinates: CENTER }, capacity: 10, currentOccupancy: 10, status: SHELTER_STATUS.FULL },
      { name: 'Closed', location: { type: 'Point', coordinates: CENTER }, capacity: 10, status: SHELTER_STATUS.CLOSED },
      { name: 'Unsafe', location: { type: 'Point', coordinates: CENTER }, capacity: 10, status: SHELTER_STATUS.UNSAFE },
      { name: 'Good', location: { type: 'Point', coordinates: CENTER }, capacity: 10, currentOccupancy: 2, status: SHELTER_STATUS.AVAILABLE },
    ]);

    const res = await authed(
      request(app).get(`/api/v1/shelters/recommended?lng=${CENTER[0]}&lat=${CENTER[1]}`)
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Good');
  });

  it('ranks the least occupied, closest shelter first among candidates', async () => {
    await Shelter.create([
      { name: 'Far but empty', location: { type: 'Point', coordinates: [CENTER[0] + 0.5, CENTER[1] + 0.5] }, capacity: 100, currentOccupancy: 0, status: SHELTER_STATUS.AVAILABLE },
      { name: 'Close and empty', location: { type: 'Point', coordinates: CENTER }, capacity: 100, currentOccupancy: 0, status: SHELTER_STATUS.AVAILABLE },
    ]);

    const res = await authed(
      request(app).get(`/api/v1/shelters/recommended?lng=${CENTER[0]}&lat=${CENTER[1]}&maxDistanceKm=100`)
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Close and empty');
  });
});
