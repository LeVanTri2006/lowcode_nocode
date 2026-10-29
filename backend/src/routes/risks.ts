import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

// Lấy danh sách rủi ro
router.get('/', async (req, res) => {
  try {
    const { severity } = req.query;
    const where = severity ? { severity: String(severity) } : {};

    const data = await prisma.risk.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch risks'
    });
  }
});

// Lấy chi tiết một rủi ro
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid risk ID'
      });
    }

    const data = await prisma.risk.findUnique({
      where: { id }
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Risk not found'
      });
    }

    return res.json({
      success: true,
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch risk'
    });
  }
});

// Tạo rủi ro mới
router.post('/', async (req, res) => {
  try {
    const {
      title,
      score,
      severity,
      reason,
      evidence,
      created_at,
      createdAt = created_at
    } = req.body;

    if (
      !title ||
      score === undefined ||
      score === null ||
      !severity ||
      !reason ||
      evidence === undefined ||
      evidence === null
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const parsedScore = Number(score);

    if (!Number.isFinite(parsedScore)) {
      return res.status(400).json({
        success: false,
        message: 'score must be a valid number'
      });
    }

    const data = await prisma.risk.create({
      data: {
        title: String(title),
        score: parsedScore,
        severity: String(severity),
        reason: String(reason),
        evidence,
        ...(createdAt ? { createdAt: new Date(createdAt) } : {})
      }
    });

    return res.status(201).json({
      success: true,
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Database error while saving risk'
    });
  }
});

export default router;
