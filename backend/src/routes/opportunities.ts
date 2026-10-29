import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

// Lấy danh sách cơ hội
router.get('/', async (req, res) => {
  try {
    const { priority } = req.query;
    const where = priority ? { priority: String(priority) } : {};

    const data = await prisma.opportunity.findMany({
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
      message: error?.message || 'Failed to fetch opportunities'
    });
  }
});

// Lấy chi tiết một cơ hội
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid opportunity ID'
      });
    }

    const data = await prisma.opportunity.findUnique({
      where: { id }
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    return res.json({
      success: true,
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch opportunity'
    });
  }
});

// Tạo cơ hội mới
router.post('/', async (req, res) => {
  try {
    const {
      title,
      score,
      priority,
      reason,
      evidence,
      created_at,
      createdAt = created_at
    } = req.body;

    if (
      !title ||
      score === undefined ||
      score === null ||
      !priority ||
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

    const data = await prisma.opportunity.create({
      data: {
        title: String(title),
        score: parsedScore,
        priority: String(priority),
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
      message: error?.message || 'Database error while saving opportunity'
    });
  }
});

export default router;
