const request = require('supertest');
const app = require('../src/app');
const RescueTeam = require('../src/models/RescueTeam');
const { connectTestDB, clearTestDB, disconnectTestDB } = require('./utils/testDb');
const { ROLES, RESCUE_TEAM_STATUS, HELP_REQUEST_STATUS, HELP_REQUEST_SEVERITY } = require('../src/utils/constants');

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
    phone: '9995556666',
    email,
    password: 'StrongPass123',
    role,
  });
  return { token: res.body.data.token, id: res.body.data.user.id };
};

const validPayload = {
  location: { type: 'Point', coordinates: CENTER },
  severity: HELP_REQUEST_SEVERITY.HIGH,
  peopleCount: 3,
  description: 'Trapped by rising water',
};

describe('POST /api/v1/help-requests', () => {
  it('creates a request, calculates priority, and assigns an available team', async () => {
    const citizen = await registerAs(ROLES.USER, 'citizen1@example.com');
    const rescueEmail = 'rescueteam1@example.com';
    const rescueAccount = await registerAs(ROLES.RESCUE_TEAM, rescueEmail);
    await RescueTeam.create({
      teamName: 'Alpha',
      contact: rescueEmail,
      location: { type: 'Point', coordinates: CENTER },
      capacity: 4,
      status: RESCUE_TEAM_STATUS.AVAILABLE,
    });

    const res = await request(app)
      .post('/api/v1/help-requests')
      .set('Authorization', `Bearer ${citizen.token}`)
      .send(validPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.helpRequest.status).toBe(HELP_REQUEST_STATUS.ASSIGNED);
    expect(res.body.data.helpRequest.priorityScore).toBeGreaterThan(0);
    expect(res.body.data.assignedTeam).not.toBeNull();
  });

  it('leaves the request PENDING when no team is available', async () => {
    const citizen = await registerAs(ROLES.USER, 'citizen2@example.com');

    const res = await request(app)
      .post('/api/v1/help-requests')
      .set('Authorization', `Bearer ${citizen.token}`)
      .send(validPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.helpRequest.status).toBe(HELP_REQUEST_STATUS.PENDING);
    expect(res.body.data.assignedTeam).toBeNull();
  });

  it('rejects invalid input', async () => {
    const citizen = await registerAs(ROLES.USER, 'citizen3@example.com');

    const res = await request(app)
      .post('/api/v1/help-requests')
      .set('Authorization', `Bearer ${citizen.token}`)
      .send({ severity: 'NOT_REAL', peopleCount: -1 });

    expect(res.statusCode).toBe(400);
  });

  it('rejects a RESCUE_TEAM account creating a help request', async () => {
    const rescueAccount = await registerAs(ROLES.RESCUE_TEAM, 'notcitizen@example.com');

    const res = await request(app)
      .post('/api/v1/help-requests')
      .set('Authorization', `Bearer ${rescueAccount.token}`)
      .send(validPayload);

    expect(res.statusCode).toBe(403);
  });
});

describe('Full emergency workflow', () => {
  it('moves a request through ASSIGNED -> EN_ROUTE -> ON_SCENE -> RESOLVED', async () => {
    const citizen = await registerAs(ROLES.USER, 'citizen4@example.com');
    const rescueEmail = 'rescueteam2@example.com';
    const rescueAccount = await registerAs(ROLES.RESCUE_TEAM, rescueEmail);
    await RescueTeam.create({
      teamName: 'Bravo',
      contact: rescueEmail,
      location: { type: 'Point', coordinates: CENTER },
      capacity: 4,
      status: RESCUE_TEAM_STATUS.AVAILABLE,
    });

    const createRes = await request(app)
      .post('/api/v1/help-requests')
      .set('Authorization', `Bearer ${citizen.token}`)
      .send(validPayload);

    const requestId = createRes.body.data.helpRequest._id;
    expect(createRes.body.data.helpRequest.status).toBe(HELP_REQUEST_STATUS.ASSIGNED);

    const acceptRes = await request(app)
      .patch(`/api/v1/help-requests/${requestId}/accept`)
      .set('Authorization', `Bearer ${rescueAccount.token}`);
    expect(acceptRes.statusCode).toBe(200);
    expect(acceptRes.body.data.status).toBe(HELP_REQUEST_STATUS.EN_ROUTE);

    const onSceneRes = await request(app)
      .patch(`/api/v1/help-requests/${requestId}/status`)
      .set('Authorization', `Bearer ${rescueAccount.token}`)
      .send({ status: HELP_REQUEST_STATUS.ON_SCENE });
    expect(onSceneRes.statusCode).toBe(200);
    expect(onSceneRes.body.data.status).toBe(HELP_REQUEST_STATUS.ON_SCENE);

    const completeRes = await request(app)
      .patch(`/api/v1/help-requests/${requestId}/complete`)
      .set('Authorization', `Bearer ${rescueAccount.token}`);
    expect(completeRes.statusCode).toBe(200);
    expect(completeRes.body.data.status).toBe(HELP_REQUEST_STATUS.RESOLVED);
    expect(completeRes.body.data.completedAt).not.toBeNull();
  });

  it('rejects an invalid status transition', async () => {
    const citizen = await registerAs(ROLES.USER, 'citizen5@example.com');
    const rescueEmail = 'rescueteam3@example.com';
    const rescueAccount = await registerAs(ROLES.RESCUE_TEAM, rescueEmail);
    await RescueTeam.create({
      teamName: 'Charlie',
      contact: rescueEmail,
      location: { type: 'Point', coordinates: CENTER },
      capacity: 4,
      status: RESCUE_TEAM_STATUS.AVAILABLE,
    });

    const createRes = await request(app)
      .post('/api/v1/help-requests')
      .set('Authorization', `Bearer ${citizen.token}`)
      .send(validPayload);

    const requestId = createRes.body.data.helpRequest._id;

    const res = await request(app)
      .patch(`/api/v1/help-requests/${requestId}/status`)
      .set('Authorization', `Bearer ${rescueAccount.token}`)
      .send({ status: HELP_REQUEST_STATUS.RESOLVED });

    expect(res.statusCode).toBe(400);
  });

  it('denies access to a help request the requester does not own', async () => {
    const citizen = await registerAs(ROLES.USER, 'citizen6@example.com');
    const stranger = await registerAs(ROLES.USER, 'stranger@example.com');

    const createRes = await request(app)
      .post('/api/v1/help-requests')
      .set('Authorization', `Bearer ${citizen.token}`)
      .send(validPayload);

    const requestId = createRes.body.data.helpRequest._id;

    const res = await request(app)
      .get(`/api/v1/help-requests/${requestId}`)
      .set('Authorization', `Bearer ${stranger.token}`);

    expect(res.statusCode).toBe(403);
  });

  it('returns 404 for a non-existent help request', async () => {
    const citizen = await registerAs(ROLES.USER, 'citizen7@example.com');
    const fakeId = '64f000000000000000000000';

    const res = await request(app)
      .get(`/api/v1/help-requests/${fakeId}`)
      .set('Authorization', `Bearer ${citizen.token}`);

    expect(res.statusCode).toBe(404);
  });
});
