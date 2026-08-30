const request = require('supertest');
const app = require('../src/app');
const RescueTeam = require('../src/models/RescueTeam');
const { connectTestDB, clearTestDB, disconnectTestDB } = require('./utils/testDb');
const { RESCUE_TEAM_STATUS, ROLES } = require('../src/utils/constants');

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

const registerAs = async (role, email) => {
  const res = await request(app).post('/api/v1/auth/register').send({
    name: `${role} tester`,
    phone: '9993334444',
    email,
    password: 'StrongPass123',
    role,
  });
  return res.body.data.token;
};

describe('GET /api/v1/rescue-teams', () => {
  it('lists all rescue teams', async () => {
    const token = await registerAs(ROLES.USER, 'rescuelist@example.com');
    await RescueTeam.create({
      teamName: 'Alpha',
      contact: 'alpha@demo.local',
      location: { type: 'Point', coordinates: CENTER },
      capacity: 4,
    });

    const res = await request(app).get('/api/v1/rescue-teams').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});

describe('GET /api/v1/rescue-teams/:id', () => {
  it('returns a team by id', async () => {
    const token = await registerAs(ROLES.USER, 'rescueget@example.com');
    const team = await RescueTeam.create({
      teamName: 'Bravo',
      contact: 'bravo@demo.local',
      location: { type: 'Point', coordinates: CENTER },
      capacity: 4,
    });

    const res = await request(app)
      .get(`/api/v1/rescue-teams/${team._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.teamName).toBe('Bravo');
  });
});

describe('GET /api/v1/rescue-teams/nearby', () => {
  it('returns nearby rescue teams', async () => {
    const token = await registerAs(ROLES.USER, 'rescuenearby@example.com');
    await RescueTeam.create({
      teamName: 'Charlie',
      contact: 'charlie@demo.local',
      location: { type: 'Point', coordinates: CENTER },
      capacity: 4,
    });

    const res = await request(app)
      .get(`/api/v1/rescue-teams/nearby?lng=${CENTER[0]}&lat=${CENTER[1]}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});

describe('PATCH /api/v1/rescue-teams/status', () => {
  it('updates status for the linked rescue team account', async () => {
    const email = 'rescuestatus@example.com';
    const token = await registerAs(ROLES.RESCUE_TEAM, email);
    await RescueTeam.create({
      teamName: 'Delta',
      contact: email,
      location: { type: 'Point', coordinates: CENTER },
      capacity: 4,
      status: RESCUE_TEAM_STATUS.AVAILABLE,
    });

    const res = await request(app)
      .patch('/api/v1/rescue-teams/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: RESCUE_TEAM_STATUS.OFFLINE });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe(RESCUE_TEAM_STATUS.OFFLINE);
  });

  it('rejects an invalid status value', async () => {
    const email = 'rescuestatusbad@example.com';
    const token = await registerAs(ROLES.RESCUE_TEAM, email);
    await RescueTeam.create({
      teamName: 'Echo',
      contact: email,
      location: { type: 'Point', coordinates: CENTER },
      capacity: 4,
    });

    const res = await request(app)
      .patch('/api/v1/rescue-teams/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'NOT_A_REAL_STATUS' });

    expect(res.statusCode).toBe(400);
  });

  it('rejects a USER attempting to update rescue team status', async () => {
    const token = await registerAs(ROLES.USER, 'notrescue@example.com');

    const res = await request(app)
      .patch('/api/v1/rescue-teams/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: RESCUE_TEAM_STATUS.OFFLINE });

    expect(res.statusCode).toBe(403);
  });
});

describe('PATCH /api/v1/rescue-teams/location', () => {
  it('updates location for the linked rescue team account', async () => {
    const email = 'rescueloc@example.com';
    const token = await registerAs(ROLES.RESCUE_TEAM, email);
    await RescueTeam.create({
      teamName: 'Foxtrot',
      contact: email,
      location: { type: 'Point', coordinates: CENTER },
      capacity: 4,
    });

    const newCoords = [CENTER[0] + 0.01, CENTER[1] + 0.01];
    const res = await request(app)
      .patch('/api/v1/rescue-teams/location')
      .set('Authorization', `Bearer ${token}`)
      .send({ coordinates: newCoords });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.location.coordinates).toEqual(newCoords);
  });
});
