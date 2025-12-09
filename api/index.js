// Vercel serverless function handler
const app = require('../backend/server');

// Vercel serverless function için handler
module.exports = (req, res) => {
  return app(req, res);
};
