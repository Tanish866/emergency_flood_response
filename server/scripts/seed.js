require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('../src/config/env');
const User = require('../src/models/User');
const RescueTeam = require('../src/models/RescueTeam');
const Shelter = require('../src/models/Shelter');
const RiskZone = require('../src/models/RiskZone');
const Road = require('../src/models/Road');
const Report = require('../src/models/Report');
const {
  ROLES,
  RESCUE_TEAM_STATUS,
  SHELTER_STATUS,
  RISK_LEVEL,
  ROAD_STATUS,
  REPORT_TYPE,
  REPORT_STATUS,
  HELP_REQUEST_SEVERITY,
} = require('../src/utils/constants');

const DEMO_CENTER = [77.4538, 28.6692];
const DEMO_SOURCE = 'CURATED_DEMO_DATA_NOT_LIVE_GOVERNMENT_DATA';

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const jitterCoordinates = (center, spread = 0.08) => [
  Number((center[0] + randomBetween(-spread, spread)).toFixed(6)),
  Number((center[1] + randomBetween(-spread, spread)).toFixed(6)),
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const CAPABILITIES_POOL = ['WATER_RESCUE', 'MEDICAL', 'FIRE', 'STRUCTURAL_COLLAPSE', 'EVACUATION'];
const EQUIPMENT_POOL = ['BOAT', 'AMBULANCE', 'GENERATOR', 'STRETCHER', 'ROPE_KIT'];
const FACILITY_POOL = ['WATER', 'FOOD', 'MEDICAL_AID', 'ELECTRICITY', 'SANITATION'];

const seed = async () => {
  if (!env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Aborting seed.');
    process.exit(1);
  }

  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding');

  await Promise.all([
    User.deleteMany({}),
    RescueTeam.deleteMany({}),
    Shelter.deleteMany({}),
    RiskZone.deleteMany({}),
    Road.deleteMany({}),
    Report.deleteMany({}),
  ]);
  console.log('Cleared existing collections');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const admin = await User.create({
    name: 'Demo Admin',
    phone: '9990000001',
    email: 'admin@demo.local',
    password: hashedPassword,
    role: ROLES.ADMIN,
    location: { type: 'Point', coordinates: DEMO_CENTER },
  });

  const citizen = await User.create({
    name: 'Demo Citizen',
    phone: '9990000002',
    email: 'citizen@demo.local',
    password: hashedPassword,
    role: ROLES.USER,
    location: { type: 'Point', coordinates: jitterCoordinates(DEMO_CENTER) },
  });

  const rescueTeamUsers = [];
  for (let i = 1; i <= 20; i += 1) {
    const rescueUser = await User.create({
      name: `Rescue Operator ${i}`,
      phone: `999000${String(1000 + i)}`,
      email: `rescue${i}@demo.local`,
      password: hashedPassword,
      role: ROLES.RESCUE_TEAM,
      location: { type: 'Point', coordinates: jitterCoordinates(DEMO_CENTER) },
    });
    rescueTeamUsers.push(rescueUser);
  }
  console.log('Seeded demo users (admin, citizen, 20 rescue-team accounts)');

  const shelters = [];
  for (let i = 1; i <= 10; i += 1) {
    const capacity = Math.floor(randomBetween(50, 400));
    shelters.push({
      name: `Community Shelter ${i}`,
      location: { type: 'Point', coordinates: jitterCoordinates(DEMO_CENTER) },
      address: `Demo Ward ${i}, Curated Demo Region`,
      capacity,
      currentOccupancy: Math.floor(randomBetween(0, capacity)),
      status: pick([
        SHELTER_STATUS.AVAILABLE,
        SHELTER_STATUS.AVAILABLE,
        SHELTER_STATUS.AVAILABLE,
        SHELTER_STATUS.FULL,
        SHELTER_STATUS.CLOSED,
      ]),
      contact: `shelter${i}@demo.local`,
      facilities: [pick(FACILITY_POOL), pick(FACILITY_POOL)],
      source: DEMO_SOURCE,
    });
  }
  const createdShelters = await Shelter.insertMany(shelters);
  console.log(`Seeded ${createdShelters.length} shelters`);

  const rescueTeams = rescueTeamUsers.map((rescueUser, index) => ({
    teamName: `Rescue Team ${index + 1}`,
    contact: rescueUser.email,
    location: { type: 'Point', coordinates: jitterCoordinates(DEMO_CENTER) },
    status: pick([
      RESCUE_TEAM_STATUS.AVAILABLE,
      RESCUE_TEAM_STATUS.AVAILABLE,
      RESCUE_TEAM_STATUS.AVAILABLE,
      RESCUE_TEAM_STATUS.OFFLINE,
    ]),
    capacity: Math.floor(randomBetween(2, 8)),
    equipment: [pick(EQUIPMENT_POOL), pick(EQUIPMENT_POOL)],
    capabilities: [pick(CAPABILITIES_POOL), pick(CAPABILITIES_POOL)],
    members: [`Member A (${rescueUser.name})`, 'Member B'],
    isActive: true,
  }));
  const createdRescueTeams = await RescueTeam.insertMany(rescueTeams);
  console.log(`Seeded ${createdRescueTeams.length} rescue teams`);

  const riskZones = [];
  for (let i = 1; i <= 10; i += 1) {
    const center = jitterCoordinates(DEMO_CENTER, 0.1);
    const riskScore = Math.floor(randomBetween(10, 95));
    let riskLevel = RISK_LEVEL.LOW;
    if (riskScore >= 75) riskLevel = RISK_LEVEL.CRITICAL;
    else if (riskScore >= 50) riskLevel = RISK_LEVEL.HIGH;
    else if (riskScore >= 25) riskLevel = RISK_LEVEL.MEDIUM;

    riskZones.push({
      name: `Risk Zone ${i}`,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [center[0] - 0.01, center[1] - 0.01],
            [center[0] + 0.01, center[1] - 0.01],
            [center[0] + 0.01, center[1] + 0.01],
            [center[0] - 0.01, center[1] + 0.01],
            [center[0] - 0.01, center[1] - 0.01],
          ],
        ],
      },
      riskScore,
      riskLevel,
      affectedPopulation: Math.floor(randomBetween(200, 15000)),
      source: DEMO_SOURCE,
      validFrom: new Date(),
      validUntil: null,
    });
  }
  const createdRiskZones = await RiskZone.insertMany(riskZones);
  console.log(`Seeded ${createdRiskZones.length} risk zones`);

  const roads = [];
  for (let i = 1; i <= 50; i += 1) {
    const start = jitterCoordinates(DEMO_CENTER, 0.1);
    const end = jitterCoordinates(start, 0.02);
    const status = pick([
      ROAD_STATUS.OPEN,
      ROAD_STATUS.OPEN,
      ROAD_STATUS.OPEN,
      ROAD_STATUS.HIGH_RISK,
      ROAD_STATUS.BLOCKED,
      ROAD_STATUS.CLOSED,
    ]);
    let riskLevel = RISK_LEVEL.LOW;
    if (status === ROAD_STATUS.HIGH_RISK) riskLevel = RISK_LEVEL.HIGH;
    if (status === ROAD_STATUS.CLOSED || status === ROAD_STATUS.BLOCKED) riskLevel = RISK_LEVEL.CRITICAL;

    roads.push({
      name: `Demo Road Segment ${i}`,
      geometry: { type: 'LineString', coordinates: [start, end] },
      status,
      riskLevel,
      riskPenalty: status === ROAD_STATUS.HIGH_RISK ? Math.floor(randomBetween(5, 20)) : 0,
      source: DEMO_SOURCE,
    });
  }
  const createdRoads = await Road.insertMany(roads);
  console.log(`Seeded ${createdRoads.length} road segments`);

  const reports = [];
  for (let i = 1; i <= 55; i += 1) {
    reports.push({
      userId: citizen._id,
      location: { type: 'Point', coordinates: jitterCoordinates(DEMO_CENTER) },
      type: pick(Object.values(REPORT_TYPE)),
      description: `Demo citizen report #${i}`,
      image: null,
      severity: pick(Object.values(HELP_REQUEST_SEVERITY)),
      status: pick([REPORT_STATUS.PENDING, REPORT_STATUS.PENDING, REPORT_STATUS.VERIFIED, REPORT_STATUS.REJECTED]),
    });
  }
  const createdReports = await Report.insertMany(reports);
  console.log(`Seeded ${createdReports.length} citizen reports`);

  console.log('\nSeed complete. Demo login credentials (password for all: Password123!):');
  console.log(`  Admin:   admin@demo.local`);
  console.log(`  Citizen: citizen@demo.local`);
  console.log(`  Rescue:  rescue1@demo.local ... rescue20@demo.local`);
  console.log('\nAll seeded shelters, rescue teams, roads, risk zones, and reports are CURATED DEMO DATA, not live government data.');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
