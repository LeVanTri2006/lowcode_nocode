import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const data = await prisma.aiAnalysis.findMany({
      orderBy: { createdAt: 'desc' },
      include: { socialContent: { include: { competitor: { select: { name: true } } } } }
    });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch AI analyses' });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      platform,
      content_id,
      topic,
      category,
      content_type,
      contentType = content_type,
      sentiment,
      keywords,
      summary,
      target_audience,
      targetAudience = target_audience,
      key_message,
      keyMessage = key_message
    } = req.body;

    if (
      !platform ||
      !content_id ||
      !topic ||
      !category ||
      !contentType ||
      !sentiment ||
      keywords === undefined ||
      keywords === null ||
      !summary ||
      !targetAudience ||
      !keyMessage
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const socialContent = await prisma.socialContent.findFirst({
      where: {
        platform: String(platform),
        contentId: String(content_id)
      }
    });

    if (!socialContent) {
      return res.status(404).json({
        success: false,
        message: 'Social content not found'
      });
    }

    const analysis = await prisma.aiAnalysis.upsert({
      where: {
        contentId: socialContent.id
      },
      update: {
        topic,
        category,
        contentType,
        sentiment,
        keywords,
        summary,
        targetAudience,
        keyMessage
      },
      create: {
        contentId: socialContent.id,
        topic,
        category,
        contentType,
        sentiment,
        keywords,
        summary,
        targetAudience,
        keyMessage
      }
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Database error while saving AI analysis'
    });
  }
});

export default router;
