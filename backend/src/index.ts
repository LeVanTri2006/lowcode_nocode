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

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/social-contents', socialContentRoutes);
app.use('/api/social-metrics', socialMetricRoutes);
app.use('/api/ai-analyses', aiAnalysisRoutes);
app.use('/api/performance-data', performanceDataRoutes);
app.use('/api/performance-analyses', performanceAnalysesRoutes);
app.use('/api/monitoring-data', monitoringDataRoutes);
app.use('/api/monitoring-alerts', monitoringAlertsRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Unexpected server error', error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
