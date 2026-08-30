const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const ApiResponse = require('./utils/ApiResponse');
const asyncHandler = require('./utils/asyncHandler');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.get(
  '/health',
  asyncHandler(async (req, res) => {
    const mongoose = require('mongoose');
    const dbStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    const dbState = dbStateMap[mongoose.connection.readyState] || 'unknown';

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          status: 'ok',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          environment: env.NODE_ENV,
          database: dbState,
        },
        'Server is healthy'
      )
    );
  })
);

const { API_VERSION } = require('./utils/constants');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const rescueRoutes = require('./routes/rescue.routes');
const shelterRoutes = require('./routes/shelter.routes');
const helpRequestRoutes = require('./routes/helpRequest.routes');
const riskRoutes = require('./routes/risk.routes');
const routeRoutes = require('./routes/route.routes');
const reportRoutes = require('./routes/report.routes');
const adminRoutes = require('./routes/admin.routes');
const notificationRoutes = require('./routes/notification.routes');
const teamRoutes = require('./routes/team.routes');

app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/rescue-teams`, rescueRoutes);
app.use(`${API_VERSION}/shelters`, shelterRoutes);
app.use(`${API_VERSION}/help-requests`, helpRequestRoutes);
app.use(`${API_VERSION}/risk`, riskRoutes);
app.use(`${API_VERSION}/routes`, routeRoutes);
app.use(`${API_VERSION}/reports`, reportRoutes);
app.use(`${API_VERSION}/admin`, adminRoutes);
app.use(`${API_VERSION}/notifications`, notificationRoutes);
app.use(`${API_VERSION}/teams`, teamRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;