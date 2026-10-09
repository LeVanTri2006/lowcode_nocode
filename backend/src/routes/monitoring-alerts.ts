import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const competitorId = req.query.competitorId ? Number(req.query.competitorId) : undefined;
    if (competitorId !== undefined && !Number.isInteger(competitorId)) {
      return res.status(400).json({ success: false, message: 'competitorId must be an integer' });
    }
    const where = {
      ...(competitorId === undefined ? {} : { competitorId }),
      ...(req.query.alertType ? { alertType: String(req.query.alertType) } : {})
    };
    const data = await prisma.monitoringAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        competitor: { select: { name: true } },
        socialContent: { select: { contentId: true, title: true, url: true, platform: true } }
      }
    });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch monitoring alerts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      content_id,
      contentId = content_id,
      competitor_id,
      competitorId = competitor_id,
      platform,
      alert_type,
      alertType = alert_type,
      message,
      views_change,
      viewsChange = views_change,
      likes_change,
      likesChange = likes_change,
      comments_change,
      commentsChange = comments_change,
      views_growth_rate,
      viewsGrowthRate = views_growth_rate,
      likes_growth_rate,
      likesGrowthRate = likes_growth_rate,
      comments_growth_rate,
      commentsGrowthRate = comments_growth_rate
    } = req.body;

    if (
      contentId === undefined ||
      contentId === null ||
      competitorId === undefined ||
      competitorId === null ||
      !platform ||
      !alertType ||
      !message ||
      viewsChange === undefined ||
      likesChange === undefined ||
      commentsChange === undefined ||
      viewsGrowthRate === undefined ||
      likesGrowthRate === undefined ||
      commentsGrowthRate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const numViewsChange = Number(viewsChange);
    const numLikesChange = Number(likesChange);
    const numCommentsChange = Number(commentsChange);
    const numViewsGrowthRate = Number(viewsGrowthRate);
    const numLikesGrowthRate = Number(likesGrowthRate);
    const numCommentsGrowthRate = Number(commentsGrowthRate);

    if (
      isNaN(numViewsChange) ||
      isNaN(numLikesChange) ||
      isNaN(numCommentsChange) ||
      isNaN(numViewsGrowthRate) ||
      isNaN(numLikesGrowthRate) ||
      isNaN(numCommentsGrowthRate)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Numeric fields must be valid numbers'
      });
    }

    let socialContent = null;
    const parsedContentId = parseInt(String(contentId), 10);
    if (!isNaN(parsedContentId)) {
      socialContent = await prisma.socialContent.findUnique({
        where: { id: parsedContentId }
      });
    }
    if (!socialContent) {
      socialContent = await prisma.socialContent.findFirst({
        where: { contentId: String(contentId) }
      });
    }

    const parsedCompetitorId = parseInt(String(competitorId), 10);
    const competitor = !isNaN(parsedCompetitorId)
      ? await prisma.competitor.findUnique({ where: { id: parsedCompetitorId } })
      : null;

    if (!socialContent || !competitor) {
      return res.status(404).json({
        success: false,
        message: 'Referenced content or competitor does not exist'
      });
    }

    const alert = await prisma.monitoringAlert.create({
      data: {
        contentId: socialContent.id,
        competitorId: competitor.id,
        platform: String(platform),
        alertType: String(alertType),
        message: String(message),
        viewsChange: Math.round(numViewsChange),
        likesChange: Math.round(numLikesChange),
        commentsChange: Math.round(numCommentsChange),
        viewsGrowthRate: numViewsGrowthRate,
        likesGrowthRate: numLikesGrowthRate,
        commentsGrowthRate: numCommentsGrowthRate
      }
    });

    res.json({
      success: true,
      data: alert
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Database error while saving monitoring alert'
    });
  }
});

export default router;
