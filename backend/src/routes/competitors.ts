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

export default router;
