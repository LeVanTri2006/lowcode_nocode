import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

// Lấy danh sách báo cáo
router.get('/', async (_req, res) => {
  try {
    const data = await prisma.report.findMany({
      orderBy: { generatedAt: 'desc' }
    });

    return res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch reports'
    });
  }
});

// Tạo báo cáo mới
router.post('/', async (req, res) => {
  try {
    const {
      report_type,
      reportType = report_type,
      title,
      executive_summary,
      executiveSummary = executive_summary,
      period,
      report_data,
      reportData = report_data,
      generated_at,
      generatedAt = generated_at
    } = req.body;

    if (
      !reportType ||
      !title ||
      !executiveSummary ||
      period === undefined ||
      period === null ||
      reportData === undefined ||
      reportData === null
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const parsedPeriod =
      typeof period === 'string' ? JSON.parse(period) : period;

    const parsedReportData =
      typeof reportData === 'string'
        ? JSON.parse(reportData)
        : reportData;

    const data = await prisma.report.create({
      data: {
        reportType: String(reportType),
        title: String(title),
        executiveSummary: String(executiveSummary),
        period: parsedPeriod,
        reportData: parsedReportData,
        ...(generatedAt ? { generatedAt: new Date(generatedAt) } : {})
      }
    });

    return res.status(201).json({
      success: true,
      data
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || 'Invalid report data'
    });
  }
});

export default router;
