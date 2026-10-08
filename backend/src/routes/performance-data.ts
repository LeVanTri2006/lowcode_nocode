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
          take: 1
        }
      }
    });

    const data = contents.map(content => {
      const latestMetric = content.socialMetrics[0] || null;
      return {
        id: content.id,
        competitorId: content.competitorId,
        competitorName: content.competitor?.name || '',
        platform: content.platform,
        contentId: content.contentId,
        title: content.title,
        description: content.description,
        url: content.url,
        publishedAt: content.publishedAt,
        views: latestMetric ? latestMetric.views : 0,
        likes: latestMetric ? latestMetric.likes : 0,
        comments: latestMetric ? latestMetric.comments : 0,
        shares: latestMetric ? latestMetric.shares : null,
        capturedAt: latestMetric ? latestMetric.capturedAt : null
      };
    });

    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Database error while fetching performance data'
    });
  }
});

export default router;
