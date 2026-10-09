import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // This is the internal SocialContent.id, not the platform's video ID.
    const socialContentId = req.query.socialContentId ? Number(req.query.socialContentId) : undefined;
    if (socialContentId !== undefined && !Number.isInteger(socialContentId)) {
      return res.status(400).json({ success: false, message: 'socialContentId must be an integer' });
    }
    const data = await prisma.socialMetric.findMany({
      where: socialContentId === undefined ? {} : { socialContentId },
      orderBy: { capturedAt: 'asc' },
      include: { socialContent: { include: { competitor: { select: { name: true } } } } }
    });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch social metrics' });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { content_id, views, likes, comments, shares, captured_at } = req.body;
    
    if (!content_id) {
      return res.status(400).json({ success: false, message: 'Missing required field: content_id' });
    }

    // Try to find the social content by content_id (string ID from platform)
    // NOTE: This assumes content_id is unique enough across platforms, or we might need platform parameter.
    // The user's request only had content_id in social-metrics payload. We'll find first match.
    const socialContent = await prisma.socialContent.findFirst({
      where: { contentId: content_id }
    });

    if (!socialContent) {
      return res.status(404).json({ success: false, message: 'Social content not found' });
    }

    const capturedAtDate = captured_at ? new Date(captured_at) : new Date();

    const socialMetric = await prisma.socialMetric.create({
      data: {
        socialContentId: socialContent.id,
        views: views || 0,
        likes: likes || 0,
        comments: comments || 0,
        shares: shares !== undefined ? shares : null,
        capturedAt: capturedAtDate
      }
    });

    res.json({ success: true, data: socialMetric });
  } catch (error) {
    next(error);
  }
});

export default router;
