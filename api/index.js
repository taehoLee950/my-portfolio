import 'dotenv/config';
import './config/sentry.js';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import sequelize from './config/sequelize.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorMiddleware.js';
import passport from './config/passport.js';

const app = express();

// Trust proxy (Vercel 배포 시 필요)
app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Self-diagnostic: env loaded?
    const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
      console.error('[ENV] Missing required variables:', missing.join(', '));
      console.error('Check your api/.env file and restart the server.');
      process.exit(1);
    }

    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('Database models synced.');
    }

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        console.error('Close the process using the port, then restart: npm run dev');
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

export default app;