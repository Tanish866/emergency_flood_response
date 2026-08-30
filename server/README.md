# Emergency Response Platform — Backend

## 1. Project Overview

Backend for a real-time Emergency Response Platform connecting citizens, rescue teams, shelters, and admin/disaster-management staff. It handles emergency request intake, priority scoring, rescue team allocation, safe routing around blocked/high-risk roads, shelter recommendation, risk awareness, citizen incident reporting, and real-time updates over Socket.IO.

This is decision-support software. Rescue allocation, shelter recommendation, routing, and risk scoring are **recommendations** — operational authority stays with authenticated rescue teams and admin staff. Nothing in this backend triggers an autonomous, irreversible action.

## 2. Architecture

Modular monolith. Node.js/Express is the entire application backend — routes are thin, business logic lives in `services/`, and pure calculations live in `algorithms/`. AI inference is treated as an external, optional dependency (`services/ai.service.js` calls out to `AI_SERVICE_URL`); this repository does not include that inference service. If it's unreachable or unconfigured, risk prediction falls back to a clearly labeled simulated response rather than fabricating a number — see §14 and §16.

```
Client apps (citizen / rescue / admin)
        ↓
Node.js / Express (modular monolith)
   routes → controllers → services → models
        ↓                      ↑
   algorithms/            Socket.IO (real-time)
        ↓
   MongoDB Atlas (Mongoose, 2dsphere geospatial indexes)

services/ai.service.js ⇄ external AI inference endpoint (optional, not included here)
```

## 3. Folder Structure

```
server/
├── src/
│   ├── config/         db.js, env.js, socket.js
│   ├── models/         User, RescueTeam, Shelter, HelpRequest, RiskZone, Road, Report, Notification
│   ├── controllers/    HTTP request/response handling per module
│   ├── routes/         endpoint definitions, mounted under /api/v1
│   ├── services/       business logic, DB access, orchestration
│   ├── algorithms/     priorityScoring, rescueAllocation, shelterScoring, routeScoring
│   ├── middleware/     auth, role, validation, centralized error handling
│   ├── validators/     hand-rolled input validation (no external schema library)
│   ├── utils/          ApiError, ApiResponse, asyncHandler, distance, constants
│   ├── sockets/        Socket.IO connection + room registration
│   ├── app.js          Express app: middleware, routes, error handling
│   └── server.js       HTTP server, DB connect, Socket.IO bootstrap
├── scripts/
│   └── seed.js          seeds curated demo data
├── tests/
│   ├── utils/testDb.js  in-memory MongoDB helper for tests
│   ├── auth.test.js
│   ├── shelter.test.js
│   ├── rescue.test.js
│   ├── helpRequest.test.js
│   └── routing.test.js
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env / .env.example
├── .gitignore
├── package.json
└── README.md
```

No file was renamed, moved, or added outside this structure. No comments are used in any source file.

## 4. Technology Stack

Express, Mongoose/MongoDB Atlas, JWT + bcrypt, Socket.IO, GeoJSON with `2dsphere` indexes, Jest + Supertest (+ `mongodb-memory-server` for isolated test runs), Docker. No Redis, Kafka, RabbitMQ, or microservices were introduced.

## 5. Environment Setup

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | — | `development`, `test`, or `production` |
| `PORT` | — | HTTP port (default `5000`) |
| `MONGODB_URI` | production | MongoDB Atlas connection string |
| `JWT_SECRET` | production | JWT signing secret |
| `JWT_EXPIRES_IN` | — | e.g. `7d` |
| `AI_SERVICE_URL` | — | External AI inference endpoint. Left unset → risk prediction returns a labeled simulated response |
| `CLIENT_URL` | — | Frontend origin for CORS |

## 6. MongoDB Setup

Use a MongoDB Atlas cluster (or any MongoDB 6+ instance). Put its connection string in `MONGODB_URI`. `2dsphere` indexes are declared directly on the Mongoose schemas (`User.location`, `RescueTeam.location`, `Shelter.location`, `HelpRequest.location`, `RiskZone.geometry`, `Road.geometry`, `Report.location`) and are created automatically the first time the app connects.

## 7. Installation

```bash
cd server
npm install
```

## 8. Running the Development Server

```bash
npm run dev      # nodemon
npm start        # plain node
```

`src/server.js` connects to MongoDB, then starts the HTTP server with Socket.IO attached. If `MONGODB_URI` is empty, the server still boots (useful for exercising `/health`), but every route touching the database will fail until it's set.

## 9. Seeding the Database

```bash
npm run seed
```

`scripts/seed.js` clears the collections it owns (`users`, `rescueTeams`, `shelters`, `riskZones`, `roads`, `reports`) and inserts:

- 1 admin (`admin@demo.local`), 1 citizen (`citizen@demo.local`), 20 rescue-team accounts (`rescue1@demo.local` … `rescue20@demo.local`) — password `Password123!` for all
- 10 shelters, 20 rescue teams (linked to the 20 rescue-team user accounts by email), 10 risk zones, 50 road segments, 55 citizen reports

All seeded records set `source: 'CURATED_DEMO_DATA_NOT_LIVE_GOVERNMENT_DATA'` (shelters, risk zones, roads) or are otherwise clearly demo content. **None of it is live government or emergency-services data.**

## 10. Complete API List

All routes are versioned under `/api/v1`. 🔒 = requires `Authorization: Bearer <token>`.

**Auth** — `POST /auth/register`, `POST /auth/login`, `GET /auth/me` 🔒, `POST /auth/logout` 🔒

**User** — `GET /users/me` 🔒, `PATCH /users/me` 🔒, `PATCH /users/me/location` 🔒

**Shelter** — `GET /shelters` 🔒, `GET /shelters/:id` 🔒, `GET /shelters/nearby` 🔒, `GET /shelters/recommended` 🔒

**Rescue** — `GET /rescue-teams` 🔒, `GET /rescue-teams/:id` 🔒, `GET /rescue-teams/nearby` 🔒, `PATCH /rescue-teams/status` 🔒 (RESCUE_TEAM), `PATCH /rescue-teams/location` 🔒 (RESCUE_TEAM)

**Help Request** — `POST /help-requests` 🔒 (USER), `GET /help-requests/my` 🔒 (USER), `GET /help-requests/:id` 🔒, `PATCH /help-requests/:id/accept` 🔒 (RESCUE_TEAM), `PATCH /help-requests/:id/reject` 🔒 (RESCUE_TEAM), `PATCH /help-requests/:id/status` 🔒 (RESCUE_TEAM, ADMIN), `PATCH /help-requests/:id/complete` 🔒 (RESCUE_TEAM, ADMIN)

**Risk** — `GET /risk/zones` 🔒, `GET /risk/nearby` 🔒, `GET /risk/:id` 🔒, `POST /risk/predict` 🔒

**Route** — `POST /routes/safe` 🔒, `POST /routes/recalculate` 🔒

**Report** — `POST /reports` 🔒, `GET /reports/nearby` 🔒, `GET /reports/my` 🔒, `PATCH /reports/:id/verify` 🔒 (ADMIN), `PATCH /reports/:id/reject` 🔒 (ADMIN)

**Admin** (all ADMIN-only) — `GET /admin/dashboard`, `GET /admin/help-requests`, `GET /admin/rescue-teams`, `GET /admin/shelters`, `PATCH /admin/roads/:id`, `PATCH /admin/shelters/:id`, `PATCH /admin/rescue-teams/:id`, `PATCH /admin/risk-zones/:id`

**Health** — `GET /health` (unversioned, unauthenticated)

No endpoint was renamed and no alternate/duplicate endpoints were silently added.

### Response shape

Success:
```json
{ "success": true, "message": "...", "data": ... }
```
Error:
```json
{ "success": false, "message": "...", "errors": [] }
```
`errors` is an array of validation messages when the failure is a `400`; stack traces are only attached when `NODE_ENV=development`.

### Example: create a help request

```
POST /api/v1/help-requests
Authorization: Bearer <JWT for a USER account>
Content-Type: application/json

{
  "location": { "type": "Point", "coordinates": [77.4538, 28.6692] },
  "severity": "HIGH",
  "peopleCount": 3,
  "description": "Trapped by rising water"
}
```
```json
{
  "success": true,
  "message": "Help request created",
  "data": {
    "helpRequest": { "_id": "...", "status": "ASSIGNED", "priorityScore": 69, "assignedTeamId": "..." },
    "assignedTeam": { "_id": "...", "teamName": "Rescue Team 4" }
  }
}
```

## 11. Authentication

- `POST /auth/register` hashes the password with bcrypt (10 salt rounds) and returns a JWT.
- `POST /auth/login` verifies the password and returns a JWT.
- All protected routes require `Authorization: Bearer <token>`.
- `authenticate` middleware verifies the JWT, reloads the user from the database (so deactivated users are rejected even with a still-valid token), and attaches `req.user = { id, role, email, name }`.
- `POST /auth/logout` is a stateless acknowledgement — JWTs are not server-side revoked; the client discards the token. This is documented here rather than silently implied.
- Passwords are never returned in any response (`select: false` on the schema field, and controllers only ever return a sanitized user object).

## 12. Role Permissions

Three roles: `USER`, `RESCUE_TEAM`, `ADMIN`. Enforced server-side via `role.middleware.js`'s `authorize(...roles)` — the client-supplied role is never trusted; role is read from the persisted `User` document at authentication time.

- **USER** — create/view own help requests, submit/view own reports, browse shelters/rescue teams/risk/routes.
- **RESCUE_TEAM** — update own team's status/location, accept/reject/advance help requests assigned to their team.
- **ADMIN** — dashboard, full visibility into requests/teams/shelters, verify/reject reports, patch roads/shelters/rescue-teams/risk-zones.

**Known limitation:** a rescue-team `User` account is linked to its `RescueTeam` document by matching `RescueTeam.contact` to the authenticated user's email (see `resolveRequestingTeamId` / `resolveActor` in the rescue and help-request controllers). There is no dedicated foreign key in the schema (the architecture document didn't specify one), so seeded rescue accounts and their team documents share the same email address by convention. A production build should probably add an explicit `userId` reference on `RescueTeam` — flagged here rather than silently changing the documented model shape.

## 13. Socket.IO Events

Connect with a JWT: `io(URL, { auth: { token } })`. The server verifies the token during the handshake and joins the socket to `user:<id>` and, for rescue/admin roles, `role:RESCUE_TEAM` / `role:ADMIN`.

**User-facing:** `riskUpdated`, `routeUpdated`, `shelterUpdated`, `rescueAssigned`, `rescueStatusUpdated`, `emergencyAlert`
**Rescue-facing:** `newHelpRequest`, `requestCancelled`, `routeUpdated`
**Admin-facing:** `newHelpRequest`, `roadStatusChanged`, `shelterStatusChanged`, `rescueStatusChanged`, `riskChanged`

Emission is scoped to authenticated rooms only (`emitToUser`, `emitToRole` in `notification.service.js`) — an unauthenticated or wrongly-authorized socket never joins an operational room, so it cannot receive these events.

## 14. AI Service Integration

`src/services/ai.service.js` is a thin HTTP client, not an AI implementation. If `AI_SERVICE_URL` is set, `POST /api/v1/risk/predict` forwards the request body to `<AI_SERVICE_URL>/predict` and relays the result. If the URL is unset, the request times out (3s), or the remote service errors, the endpoint returns:

```json
{
  "riskScore": null,
  "riskLevel": null,
  "isSimulated": true,
  "isAiServiceAvailable": false,
  "disclaimer": "AI inference service is unavailable. This is not a real prediction; no risk value has been fabricated."
}
```

This repository intentionally does not include the FastAPI inference service — only the Node-side integration point, per your instruction to build backend services only.

## 15. Missing-Data / Failure Handling

- AI service unreachable → labeled simulated response, not a crash, not a fabricated score (§14).
- No risk zones near a point → `getRiskScoreNear` returns `0`, never an invented value.
- No known road segments near a route's origin → `route: null`, `isSafe: false`, with an explicit reason string; safety is never assumed.
- Any unmatched route → structured `404` via `notFoundHandler`.
- Any uncaught error → structured `500` via `errorHandler`, with stack traces stripped outside `development`.

## 16. Testing

```bash
npm test
```

Uses Jest + Supertest against the Express `app` directly, backed by an in-memory MongoDB instance (`mongodb-memory-server`) via `tests/utils/testDb.js` — no shared state with your real `MONGODB_URI`, nothing is written to Atlas by the test suite, and each test file cleans its collections between tests.

Coverage by file:
- `health.test.js` — health endpoint shape, 404 handling
- `auth.test.js` — register, duplicate email, invalid email/password, login, wrong password, non-existent user, `/me`, unauthenticated access, role restriction
- `shelter.test.js` — list, get by id, invalid id, nearby, empty nearby, FULL/CLOSED/UNSAFE exclusion from recommendation, ranking by distance/occupancy
- `rescue.test.js` — list, get by id, nearby, status update (valid/invalid/unauthorized role), location update
- `helpRequest.test.js` — creation with auto-assignment, creation with no team available, validation errors, full PENDING→ASSIGNED→EN_ROUTE→ON_SCENE→RESOLVED workflow, invalid transition rejection, ownership-based access control, 404 on unknown id
- `routing.test.js` — safe route on open roads, unsafe on blocked/closed roads, high-risk cost multiplier, invalid coordinates, no-route-available case, recalculation after a road status change

### Verifying tests pass

**This sandbox has no outbound network access.** I could not run `npm install` or execute Jest here — every file was checked with `node --check` (zero syntax errors) and every relative `require()` path was programmatically verified to resolve to a real file (zero broken imports). Actual test execution has **not** happened yet. Run it yourself:

```bash
npm install
npm test
```

## 17. End-to-End Demo Flow

1. `npm run seed` — creates the admin, citizen, 20 rescue accounts, and all demo shelters/teams/roads/risk zones/reports.
2. `POST /api/v1/auth/login` as `citizen@demo.local` → get a JWT.
3. `POST /api/v1/help-requests` with a location near the demo center `[77.4538, 28.6692]` → backend computes `priorityScore`, finds the best available seeded rescue team, assigns it, and emits `rescueAssigned` to the citizen and `newHelpRequest` to that team over Socket.IO.
4. Log in as the assigned rescue account (`rescueN@demo.local`) → `PATCH /help-requests/:id/accept` → status becomes `EN_ROUTE`, citizen receives `rescueStatusUpdated`.
5. `PATCH /rescue-teams/location` to simulate movement.
6. `PATCH /help-requests/:id/status` with `{"status":"ON_SCENE"}`.
7. `PATCH /help-requests/:id/complete` → status becomes `RESOLVED`, team is released back to `AVAILABLE`, citizen gets the final update.

This exact sequence (steps 3–7, with a guaranteed available team) is exercised end-to-end in `tests/helpRequest.test.js`'s "Full emergency workflow" block.

## 18. Docker

```bash
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
docker compose up --build
```

`Dockerfile` builds a `node:20-alpine` image running `node src/server.js`. `docker-compose.yml` reads its environment from `.env` and exposes `PORT` (default `5000`). MongoDB itself stays on Atlas — no local Mongo container is created. There is no AI-service Dockerfile in this repository, matching the "backend services only" scope of this build; `AI_SERVICE_URL` can point at any externally hosted inference endpoint later.

## 19. Known Limitations

- The AI inference service itself is not included — only the client integration point and its graceful fallback.
- Rescue-team-to-user-account linkage is by email match, not a schema foreign key (see §12).
- `POST /auth/logout` doesn't maintain a token blocklist; it's a client-side "forget the token" contract.
- Rate limiting, CORS, and Helmet are configured for MVP-appropriate defaults, not hardened for a specific production threat model.
- Test suite has been written and syntax/import-verified but **not executed** in this environment due to no network access — see §16.
- `routing.service.js`'s corridor search is a straightforward radius query around the origin, not a full pathfinding graph traversal — sufficient for this MVP's "is the nearby road network passable" question, not a turn-by-turn router.

## 20. What Is Real Data vs. Curated/Demo Data

Everything inserted by `scripts/seed.js` — shelters, rescue teams, risk zones, road segments, and citizen reports — is synthetic demo data centered on a single coordinate for geographic consistency, tagged `source: 'CURATED_DEMO_DATA_NOT_LIVE_GOVERNMENT_DATA'` where the schema has a `source` field. None of it should be treated as live government, emergency-services, or population data. Any real deployment must replace this with verified official data sources before operational use.

## 21. What Is AI vs. Rule-Based

- **Rule-based (deterministic, in this codebase):** priority scoring, rescue allocation scoring, shelter scoring, route/road-segment cost scoring. All four live in `src/algorithms/` and are pure functions with fixed weights — not machine-learned, not claimed to be validated against real incident data.
- **AI (external, not included here):** risk prediction via `POST /risk/predict`, which only returns a real value if `AI_SERVICE_URL` is configured and reachable; otherwise it returns an explicitly labeled simulated/unavailable response (§14).

## 22. Production-Readiness Limitations

This is an MVP-scoped implementation, not a hardened production system:
- No token refresh/rotation or revocation list — just access tokens with an expiry.
- No structured logging/metrics/tracing beyond `morgan` request logs.
- No file storage integration for `Report.image` — the field accepts a URL/string only.
- No pagination on list endpoints (`GET /shelters`, `GET /rescue-teams`, admin lists) — acceptable at demo scale, not at city scale.
- No automated CI pipeline is included; test execution is manual (`npm test`).
- Human-in-the-loop is enforced by role checks, not by workflow design beyond that — a compromised ADMIN account could still patch shelters/roads/teams directly, as documented, since that authority is intentionally given to admins.
