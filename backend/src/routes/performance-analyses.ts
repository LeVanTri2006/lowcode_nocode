import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const competitorId = req.query.competitorId ? Number(req.query.competitorId) : undefined;
    if (competitorId !== undefined && !Number.isInteger(competitorId)) {
      return res.status(400).json({ success: false, message: 'competitorId must be an integer' });
    }
    const data = await prisma.performanceAnalysis.findMany({
      where: competitorId === undefined ? {} : { competitorId },
      orderBy: { performanceRank: 'asc' },
      include: { competitor: { select: { name: true, channelId: true, url: true } } }
    });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch performance analyses' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      competitor_id,
      competitorId = competitor_id,
      platform,
      video_count,
      videoCount = video_count,
      total_views,
      totalViews = total_views,
      total_likes,
      totalLikes = total_likes,
      total_comments,
      totalComments = total_comments,
      total_engagement,
      totalEngagement = total_engagement,
      average_views,
      averageViews = average_views,
      average_likes,
      averageLikes = average_likes,
      average_comments,
      averageComments = average_comments,
      engagement_rate,
      engagementRate = engagement_rate,
      average_like_rate,
      averageLikeRate = average_like_rate,
      average_comment_rate,
      averageCommentRate = average_comment_rate,
      performance_rank,
      performanceRank = performance_rank
    } = req.body;

    if (
      competitorId === undefined ||
      competitorId === null ||
      !platform ||
      videoCount === undefined ||
      totalViews === undefined ||
      totalLikes === undefined ||
      totalComments === undefined ||
      totalEngagement === undefined ||
      averageViews === undefined ||
      averageLikes === undefined ||
      averageComments === undefined ||
      engagementRate === undefined ||
      averageLikeRate === undefined ||
      averageCommentRate === undefined ||
      performanceRank === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const parsedCompetitorId = parseInt(String(competitorId), 10);
    if (isNaN(parsedCompetitorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid competitor_id'
      });
    }

    const competitor = await prisma.competitor.findUnique({
      where: { id: parsedCompetitorId }
    });

    if (!competitor) {
      return res.status(404).json({
        success: false,
        message: 'Competitor not found'
      });
    }

    const dataToSave = {
      videoCount: Number(videoCount),
      totalViews: Math.round(Number(totalViews)),
      totalLikes: Math.round(Number(totalLikes)),
      totalComments: Math.round(Number(totalComments)),
      totalEngagement: Math.round(Number(totalEngagement)),
      averageViews: Number(averageViews),
      averageLikes: Number(averageLikes),
      averageComments: Number(averageComments),
      engagementRate: Number(engagementRate),
      averageLikeRate: Number(averageLikeRate),
      averageCommentRate: Number(averageCommentRate),
      performanceRank: Math.round(Number(performanceRank))
    };

    const analysis = await prisma.performanceAnalysis.upsert({
      where: {
        competitorId_platform: {
          competitorId: parsedCompetitorId,
          platform: String(platform)
        }
      },
      update: dataToSave,
      create: {
        competitorId: parsedCompetitorId,
        platform: String(platform),
        ...dataToSave
      }
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Database error while saving performance analysis'
    });
  }
});

export default router;
