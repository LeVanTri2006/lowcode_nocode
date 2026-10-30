import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { platform } = req.query;
    const whereClause = platform ? { platform: String(platform) } : {};
    
    const competitors = await prisma.competitor.findMany({
      where: whereClause
    });
    
    res.json({ success: true, data: competitors });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, platform, channel_id, url } = req.body;
    
    if (!name || !platform || !url) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (platform === 'youtube' && !channel_id) {
      return res.status(400).json({ success: false, message: 'channel_id is required for YouTube platform' });
    }

    // Check conflict
    if (channel_id) {
      const existing = await prisma.competitor.findUnique({
        where: {
          platform_channelId: {
            platform,
            channelId: channel_id
          }
        }
      });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Competitor already exists' });
      }
    }

    const competitor = await prisma.competitor.create({
      data: {
        name,
        platform,
        channelId: channel_id || '',
        url
      }
    });
    
    res.json({ success: true, data: competitor });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid competitor ID' });
    }

    const deleted = await prisma.competitor.delete({
      where: { id }
    });

    const remainingCompetitors = await prisma.competitor.count();
    let downstreamCleared = false;

    // If no competitors remain or cascadeAll query is requested, clear all downstream derived workflow data (WF06-WF10)
    if (remainingCompetitors === 0 || req.query.cascadeAll === 'true') {
      await prisma.$transaction([
        prisma.trend.deleteMany(),
        prisma.opportunity.deleteMany(),
        prisma.risk.deleteMany(),
        prisma.strategy.deleteMany(),
        prisma.report.deleteMany(),
      ]);
      downstreamCleared = true;
    }

    res.json({
      success: true,
      message: downstreamCleared
        ? 'Competitor deleted and all downstream workflow analysis data (WF06-WF10) cleared'
        : 'Competitor and associated data deleted successfully',
      data: deleted,
      remainingCompetitors,
      downstreamCleared,
    });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Competitor not found' });
    }
    next(error);
  }
});

// Explicit endpoint to purge all derived workflow analysis data (WF06 to WF10)
router.post('/clean-downstream', async (_req, res, next) => {
  try {
    const [trends, opportunities, risks, strategies, reports] = await prisma.$transaction([
      prisma.trend.deleteMany(),
      prisma.opportunity.deleteMany(),
      prisma.risk.deleteMany(),
      prisma.strategy.deleteMany(),
      prisma.report.deleteMany(),
    ]);

    res.json({
      success: true,
      message: 'All downstream workflow analysis data (WF06 to WF10) cleared successfully',
      cleared: {
        trends: trends.count,
        opportunities: opportunities.count,
        risks: risks.count,
        strategies: strategies.count,
        reports: reports.count,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
