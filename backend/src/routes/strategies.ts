import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

// Lấy danh sách chiến lược
router.get('/', async (_req, res) => {
  try {
    const data = await prisma.strategy.findMany({
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
      message: error?.message || 'Failed to fetch strategies'
    });
  }
});

// Tạo chiến lược mới
router.post('/', async (req, res) => {
  try {
    const {
      title,
      objective,
      description,
      priority,
      confidence,
      evidence,
      created_at,
      createdAt = created_at
    } = req.body;

    if (
      !title ||
      !objective ||
      !description ||
      !priority ||
      confidence === undefined ||
      confidence === null ||
      evidence === undefined ||
      evidence === null
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const parsedConfidence = Number(confidence);

    if (!Number.isFinite(parsedConfidence)) {
      return res.status(400).json({
        success: false,
        message: 'confidence must be a valid number'
      });
    }

    const data = await prisma.strategy.create({
      data: {
        title: String(title),
        objective: String(objective),
        description: String(description),
        priority: String(priority),
        confidence: parsedConfidence,
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
      message: error?.message || 'Database error while saving strategy'
    });
  }
});

export default router;
