import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const contents = await prisma.socialContent.findMany({
      orderBy: {
        id: 'asc'
      },
      include: {
        competitor: {
          select: {
            name: true
          }
        },
        socialMetrics: {
          orderBy: {
            capturedAt: 'desc'
          },
          take: 2,
          select: {
            views: true,
            likes: true,
            comments: true,
            shares: true,
            capturedAt: true
          }
        }
      }
    });

    const data = contents.map(content => ({
      contentId: content.contentId,
      socialContentId: content.id,
      competitorId: content.competitorId,
      competitorName: content.competitor?.name || '',
      platform: content.platform,
      title: content.title,
      metrics: content.socialMetrics.map(metric => ({
        views: metric.views,
        likes: metric.likes,
        comments: metric.comments,
        shares: metric.shares,
        capturedAt: metric.capturedAt
      }))
    }));

    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Database error while fetching monitoring data'
    });
  }
});

export default router;
