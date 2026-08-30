const { HELP_REQUEST_SEVERITY } = require('../utils/constants');

const SEVERITY_WEIGHTS = {
  [HELP_REQUEST_SEVERITY.LOW]: 10,
  [HELP_REQUEST_SEVERITY.MEDIUM]: 30,
  [HELP_REQUEST_SEVERITY.HIGH]: 60,
  [HELP_REQUEST_SEVERITY.CRITICAL]: 90,
};

const PEOPLE_COUNT_WEIGHT = 2;
const PEOPLE_COUNT_CAP = 20;
const RISK_ZONE_WEIGHT = 0.3;

const calculatePriorityScore = ({ severity, peopleCount, riskScore = 0 }) => {
  const severityComponent = SEVERITY_WEIGHTS[severity] ?? SEVERITY_WEIGHTS[HELP_REQUEST_SEVERITY.LOW];
  const peopleComponent = Math.min(peopleCount, PEOPLE_COUNT_CAP) * PEOPLE_COUNT_WEIGHT;
  const riskComponent = riskScore * RISK_ZONE_WEIGHT;

  const rawScore = severityComponent + peopleComponent + riskComponent;

  return Math.round(Math.min(rawScore, 100));
};

module.exports = { calculatePriorityScore };
