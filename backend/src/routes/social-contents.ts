import { Router, type RequestHandler } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

export function createUnanalysedContentsHandler(
  findMany: typeof prisma.socialContent.findMany = (args) => prisma.socialContent.findMany(args),
): RequestHandler {
  return async (_req, res) => {
    try {
      const contents = await findMany({
        where: { aiAnalysis: { is: null } },
        orderBy: { id: 'asc' },
      });

      res.json({ success: true, data: contents });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error?.message || 'Failed to fetch unanalysed social contents',
      });
    }
  };
}

router.get('/unanalysed', createUnanalysedContentsHandler());

router.get('/', async (req, res) => {
  try {
    const contents = await prisma.socialContent.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    res.json({
      success: true,
      data: contents
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch social contents'
    });
  }
});

router.get('/check', async (req, res) => {
  try {
    const { platform, content_id } = req.query;

    if (!platform || !content_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameters: platform and content_id'
      });
    }

    const existingContent = await prisma.socialContent.findFirst({
      where: {
        platform: String(platform),
        contentId: String(content_id)
      }
    });

    if (existingContent) {
      return res.json({
        success: true,
        exists: true
      });
    }

    return res.json({
      success: true,
      exists: false
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Database error while checking social content'
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { competitor_id, platform, content_id, title, description, url, published_at } = req.body;
    
    if (!competitor_id || !platform || !content_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const competitor = await prisma.competitor.findUnique({
      where: { id: parseInt(competitor_id, 10) }
    });
    
    if (!competitor) {
      return res.status(404).json({ success: false, message: 'Competitor not found' });
    }

    const publishedAtDate = published_at ? new Date(published_at) : new Date();

    const socialContent = await prisma.socialContent.upsert({
      where: {
        platform_contentId: {
          platform,
          contentId: content_id
        }
      },
      update: {
        title: title || '',
        description: description || '',
        url: url || '',
        publishedAt: publishedAtDate
      },
      create: {
        competitorId: competitor.id,
        platform,
        contentId: content_id,
        title: title || '',
        description: description || '',
        url: url || '',
        publishedAt: publishedAtDate
      }
    });

    res.json({ success: true, data: socialContent });
  } catch (error) {
    next(error);
  }
});

export default router;
