import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';
import competitorRoutes from './routes/competitors';
import socialContentRoutes from './routes/social-contents';
import socialMetricRoutes from './routes/social-metrics';
import aiAnalysisRoutes from './routes/ai-analyses';
import performanceDataRoutes from './routes/performance-data';
import performanceAnalysesRoutes from './routes/performance-analyses';
import monitoringDataRoutes from './routes/monitoring-data';
import monitoringAlertsRoutes from './routes/monitoring-alerts';
import workflowRunRoutes from './routes/workflow-runs';
import authRoutes from './routes/auth';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import trendRoutes from './routes/trends';
import opportunityRoutes from './routes/opportunities';
import riskRoutes from './routes/risks';
import strategyRoutes from './routes/strategies';
import reportRoutes from './routes/reports';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
const PgSession = connectPgSimple(session);
const sessionPool = new Pool({ connectionString: process.env.DATABASE_URL });
app.use(session({
  name: 'aca.sid',
  secret: process.env.SESSION_SECRET || 'missing-session-secret-that-will-not-authenticate',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: new PgSession({ pool: sessionPool, tableName: 'auth_sessions', createTableIfMissing: true }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: 'auto',
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  },
}));

app.use('/health', healthRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/social-contents', socialContentRoutes);
app.use('/api/social-metrics', socialMetricRoutes);
app.use('/api/ai-analyses', aiAnalysisRoutes);
app.use('/api/performance-data', performanceDataRoutes);
app.use('/api/performance-analyses', performanceAnalysesRoutes);
app.use('/api/monitoring-data', monitoringDataRoutes);
app.use('/api/monitoring-alerts', monitoringAlertsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRunRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/strategies', strategyRoutes);
app.use('/api/reports', reportRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Unexpected server error', error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
