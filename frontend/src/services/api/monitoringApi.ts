import { getList } from './client';
import type { MonitoringAlert, MonitoringData } from '../../types/api';
export const getMonitoringData = (signal?: AbortSignal) => getList<MonitoringData>('/api/monitoring-data', signal);
export const getMonitoringAlerts = (signal?: AbortSignal) => getList<MonitoringAlert>('/api/monitoring-alerts', signal);
