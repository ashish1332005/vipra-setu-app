const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const ensureAdmin = require('./utils/ensureAdmin');

const startServer = async () => {
  await connectDB();

  if (process.env.SEED_ADMIN_ON_START !== 'false') {
    await ensureAdmin();
  }

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
