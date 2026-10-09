import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

// Lấy danh sách xu hướng
router.get('/', async (_req, res) => {
  try {
    const data = await prisma.trend.findMany({
      orderBy: { detectedAt: 'desc' }
    });

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch trends'
    });
  }
});

// Tạo xu hướng mới
router.post('/', async (req, res) => {
  try {
    const {
      name,
      score,
      growth_rate,
      growthRate = growth_rate,
      direction,
      reason,
      evidence,
      detected_at,
      detectedAt = detected_at
    } = req.body;

    if (
      !name ||
      score === undefined ||
      score === null ||
      growthRate === undefined ||
      growthRate === null ||
      !direction ||
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
    const parsedGrowthRate = Number(growthRate);

    if (
      !Number.isFinite(parsedScore) ||
      !Number.isFinite(parsedGrowthRate)
    ) {
      return res.status(400).json({
        success: false,
        message: 'score and growth_rate must be valid numbers'
      });
    }

    const data = await prisma.trend.create({
      data: {
        name: String(name),
        score: parsedScore,
        growthRate: parsedGrowthRate,
        direction: String(direction),
        reason: String(reason),
        evidence,
        ...(detectedAt ? { detectedAt: new Date(detectedAt) } : {})
      }
    });

    return res.status(201).json({
      success: true,
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Database error while saving trend'
    });
  }
});

export default router;
