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
│   ├── models/         User, RescueTeam, Shelter, HelpRequest, RiskZone, Road, Report, Notification, Message
│   ├── controllers/    HTTP request/response handling per module (incl. notification, team)
│   ├── routes/         endpoint definitions, mounted under /api/v1 (incl. notifications, teams)
│   ├── services/       business logic, DB access, orchestration (incl. notification, message)
│   ├── algorithms/     priorityScoring, rescueAllocation, shelterScoring, routeScoring
│   ├── middleware/     auth, role, validation, centralized error handling
│   ├── validators/     hand-rolled input validation (no external schema library)
│   ├── utils/          ApiError, ApiResponse, asyncHandler, distance, constants
│   ├── sockets/        Socket.IO connection + room registration (user/role/team rooms)
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

**Rescue** — `GET /rescue-teams` 🔒, `GET /rescue-teams/:id` 🔒, `GET /rescue-teams/nearby` 🔒, `GET /rescue-teams/me/requests` 🔒 (RESCUE_TEAM), `GET /rescue-teams/me/stats` 🔒 (RESCUE_TEAM), `PATCH /rescue-teams/status` 🔒 (RESCUE_TEAM), `PATCH /rescue-teams/location` 🔒 (RESCUE_TEAM)

**Help Request** — `POST /help-requests` 🔒 (USER), `GET /help-requests/my` 🔒 (USER), `GET /help-requests/:id` 🔒, `PATCH /help-requests/:id/accept` 🔒 (RESCUE_TEAM), `PATCH /help-requests/:id/reject` 🔒 (RESCUE_TEAM), `PATCH /help-requests/:id/status` 🔒 (RESCUE_TEAM, ADMIN), `PATCH /help-requests/:id/complete` 🔒 (RESCUE_TEAM, ADMIN)

**Risk** — `GET /risk/zones` 🔒, `GET /risk/nearby` 🔒, `GET /risk/:id` 🔒, `POST /risk/predict` 🔒

**Route** — `POST /routes/safe` 🔒, `POST /routes/recalculate` 🔒

**Report** — `POST /reports` 🔒, `GET /reports/nearby` 🔒, `GET /reports/my` 🔒, `PATCH /reports/:id/verify` 🔒 (ADMIN), `PATCH /reports/:id/reject` 🔒 (ADMIN)

**Admin** (all ADMIN-only) — `GET /admin/dashboard`, `GET /admin/help-requests`, `GET /admin/rescue-teams`, `GET /admin/shelters`, `PATCH /admin/roads/:id`, `PATCH /admin/shelters/:id`, `PATCH /admin/rescue-teams/:id`, `PATCH /admin/risk-zones/:id`

**Notifications** — `GET /notifications` 🔒, `PATCH /notifications/:id/read` 🔒, `PATCH /notifications/read-all` 🔒

**Team Chat** — `POST /teams/:teamId/messages` 🔒 (RESCUE_TEAM on their own team, or ADMIN), `GET /teams/:teamId/messages` 🔒 (same)

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

- **USER** — create/view own help requests, submit/view own reports, browse shelters/rescue teams/risk/routes, view/manage own notifications.
- **RESCUE_TEAM** — update own team's status/location, accept/reject/advance help requests assigned to their team, view own team's request history/stats, send/read messages in their own team's chat.
- **ADMIN** — dashboard, full visibility into requests/teams/shelters, verify/reject reports, patch roads/shelters/rescue-teams/risk-zones, read/post in any team's chat as `CONTROL_ROOM`.

Notifications (`/notifications`) are scoped to the requester automatically — every user, regardless of role, only ever sees their own.

**Known limitation:** a rescue-team `User` account is linked to its `RescueTeam` document by matching `RescueTeam.contact` to the authenticated user's email (see `resolveRequestingTeamId` / `resolveActor` in the rescue and help-request controllers). There is no dedicated foreign key in the schema (the architecture document didn't specify one), so seeded rescue accounts and their team documents share the same email address by convention. A production build should probably add an explicit `userId` reference on `RescueTeam` — flagged here rather than silently changing the documented model shape.

## 13. Socket.IO Events

Connect with a JWT: `io(URL, { auth: { token } })`. The server verifies the token during the handshake and joins the socket to `user:<id>` and, by role, `role:RESCUE_TEAM` / `role:ADMIN`. A `RESCUE_TEAM` socket is additionally joined to `team:<rescueTeamId>` (resolved via the same `RescueTeam.contact` ↔ email match described in §12) so team-scoped events — chat, in particular — reach only that team's own connections.

**User-facing:** `riskUpdated`, `routeUpdated`, `shelterUpdated`, `rescueAssigned`, `rescueStatusUpdated`, `emergencyAlert`, `teamLocationUpdated` (live tracking — sent to the citizen who owns the active help request whenever their assigned team's location updates)
**Rescue-facing:** `newHelpRequest`, `requestCancelled`, `routeUpdated`, `newTeamMessage` (team room)
**Admin-facing:** `newHelpRequest`, `roadStatusChanged`, `shelterStatusChanged`, `rescueStatusChanged`, `riskChanged`, `newTeamMessage` (all teams, admin room)

Emission is scoped to authenticated rooms only (`emitToUser`, `emitToRole`, `emitToTeam` in `notification.service.js`) — an unauthenticated or wrongly-authorized socket never joins an operational room, so it cannot receive these events.

**Notification persistence:** every role-broadcast event that represents an actual notification (new/updated help requests, road/shelter/rescue-team/risk-zone changes) now also writes a `Notification` document per recipient via `notifyRoleAndEmit`, so `GET /notifications` stays in sync with what was pushed over the socket — a client that was offline when the event fired still sees it on next fetch. High-frequency telemetry (`teamLocationUpdated`) is intentionally **not** persisted as a notification — it would flood the inbox; it's a live-tracking signal only.

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
- Shelter `riskLevel` is computed at read time via a `$geoIntersects` lookup per shelter (or the stored `riskZoneId` if set) — fine at demo scale, but N shelters means N zone lookups per list call; worth caching/denormalizing before scaling up.
- `notifyRoleAndEmit` persists one `Notification` document per active user in a role on every broadcast (e.g. every admin, on every road/shelter/rescue-team/risk-zone change) — acceptable for a handful of admins/citizens, but would need batching or a fan-out queue at real city scale.
- Team chat access control assumes one `RescueTeam` per `contact` email, same limitation as §12's linkage; a rescue-team user with no matching `RescueTeam` document gets a 403 rather than an empty chat.

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

## 23. Frontend-Driven Additions

Added on top of the original architecture to support a frontend UI mockup. Same conventions throughout: `{success, message, data}` response shape, `routes → controllers → services → models`, role-guarded, versioned under `/api/v1`.

### 23.1 Rescue Team History & Stats

- `GET /rescue-teams/me/requests` 🔒 (RESCUE_TEAM) — the authenticated team's help requests (any status), most recent first, via `rescue.service.js#getTeamRequestHistory`.
- `GET /rescue-teams/me/stats` 🔒 (RESCUE_TEAM) — `{ requestsToday, completedToday, inProgress }` for the current calendar day (server local time, midnight cutoff), via `rescue.service.js#getTeamStatsToday`.
- Both resolve "the authenticated team" the same way the existing status/location endpoints already did: match `RescueTeam.contact` to the JWT's email.

### 23.2 Notifications Persistence

- `Notification` model extended with `link` (existing `type`/`data`/`isRead`/`userId`/`title`/`message` fields kept — `type` and `data` predate this change and stayed for backward compatibility).
- `GET /notifications` 🔒, `PATCH /notifications/:id/read` 🔒, `PATCH /notifications/read-all` 🔒 — all scoped to the requester's own `userId`; reading or marking another user's notification returns `404`, not another user's data.
- `notification.service.js#notifyRoleAndEmit` is the mechanism that keeps broadcasts persisted: it looks up every active user in a role, bulk-inserts one `Notification` each, then emits the socket event to the role's room. Used for admin/user-facing broadcasts (help-request creation, road/shelter/rescue-team/risk-zone changes). Single-recipient events (`rescueAssigned`, status changes) already went through the pre-existing `notifyAndEmit`, unchanged.

### 23.3 Rescue Team Vehicle Info

- `RescueTeam` schema gained `vehicleType`, `vehicleName`, `fuelLevel` (0–100, optional). No new endpoint — every existing rescue-team response (list, get-by-id, nearby, admin update) already returns the full document, so these fields show up automatically. `PATCH /admin/rescue-teams/:id` already forwards `req.body` straight to the updater, so admins can set them without any additional wiring.

### 23.4 Team Chat

- New `Message` model: `teamId`, `senderRole` (`CONTROL_ROOM` | `RESCUE_TEAM`), `senderName`, `text`, timestamps.
- `POST /teams/:teamId/messages` 🔒, `GET /teams/:teamId/messages` 🔒 — restricted to ADMIN (any team, posts as `CONTROL_ROOM`) or the matching `RESCUE_TEAM` account (only their own `teamId`, posts as `RESCUE_TEAM`); anyone else gets `403`.
- On send, `newTeamMessage` is emitted to both `team:<teamId>` (that team's own sockets) and `role:ADMIN` (every connected admin/control-room socket) — so a control room dashboard watching all teams and a single team's own app both update live.
- Rescue-team sockets join `team:<teamId>` automatically on connection (`sockets/rescue.socket.js`), resolved the same way as the REST layer.

### 23.5 Shelter Risk-Zone Label

- `Shelter` schema gained an optional `riskZoneId` (ref `RiskZone`).
- Every shelter read path (`GET /shelters`, `GET /shelters/:id`, `GET /shelters/nearby`, `GET /shelters/recommended`, and the admin update response) now includes a computed `riskLevel` field: if `riskZoneId` is set, that zone's `riskLevel` is used directly; otherwise the shelter's location is checked against all `RiskZone` geometries via `$geoIntersects`, and the highest-`riskScore` intersecting zone's level is used. `riskLevel` is `null` when neither applies — never fabricated.

### 23.6 Live Rescue Team Location for Tracking

- `PATCH /rescue-teams/location` — unchanged request/response shape — now also emits `teamLocationUpdated` to the citizen who owns the team's `currentRequest` (if any), with `{ teamId, helpRequestId, coordinates }`, so a tracking screen updates without polling. If the team has no active request, nothing extra is emitted.
- **Bug found and fixed while wiring this up:** the pre-existing "notify the assigned team of a new request" logic (in `helpRequest.service.js`, on request creation and on reassignment-after-reject) was calling `emitToUser(team._id, ...)` — but sockets only join rooms keyed by the *User*'s id, never the `RescueTeam` document's id, so that event was silently reaching nobody since the very first version of this backend. Fixed by routing it through the new `emitToTeam(teamId, ...)` helper and the `team:<teamId>` room instead. Worth knowing if your frontend was ever wondering why rescue teams never got a live ping for new assignments — that's why, and it's fixed now.