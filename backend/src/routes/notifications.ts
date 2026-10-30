import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

export interface SystemNotification {
  id: string;
  type: 'alert' | 'opportunity' | 'risk' | 'report' | 'trend' | 'content';
  title: string;
  desc: string;
  timestamp: string;
  link: string;
  severity: 'high' | 'medium' | 'low' | 'info';
}

router.get('/', async (req, res) => {
  try {
    const [alerts, opportunities, risks, reports, trends, contents] = await Promise.all([
      prisma.monitoringAlert.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          competitor: { select: { name: true } },
          socialContent: { select: { title: true } }
        }
      }).catch(() => []),
      prisma.opportunity.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }).catch(() => []),
      prisma.risk.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }).catch(() => []),
      prisma.report.findMany({
        take: 5,
        orderBy: { generatedAt: 'desc' }
      }).catch(() => []),
      prisma.trend.findMany({
        take: 5,
        orderBy: { detectedAt: 'desc' }
      }).catch(() => []),
      prisma.socialContent.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          competitor: { select: { name: true } }
        }
      }).catch(() => [])
    ]);

    const notifications: SystemNotification[] = [];

    // 1. Cảnh báo đối thủ (Monitoring Alerts)
    for (const a of alerts) {
      notifications.push({
        id: `alert-${a.id}`,
        type: 'alert',
        title: `Cảnh báo biến động: ${a.competitor?.name || 'Đối thủ'}`,
        desc: a.message || `Lượt tương tác tăng: ${a.viewsChange > 0 ? '+' : ''}${a.viewsChange} views`,
        timestamp: a.createdAt.toISOString(),
        link: '/wf05',
        severity: 'high'
      });
    }

    // 2. Cơ hội nội dung (Opportunities)
    for (const o of opportunities) {
      notifications.push({
        id: `opp-${o.id}`,
        type: 'opportunity',
        title: 'Cơ hội nội dung tiềm năng',
        desc: `${o.title} • Điểm tiềm năng: ${o.score}/100`,
        timestamp: o.createdAt.toISOString(),
        link: '/wf07',
        severity: 'medium'
      });
    }

    // 3. Rủi ro cạnh tranh (Risks)
    for (const r of risks) {
      notifications.push({
        id: `risk-${r.id}`,
        type: 'risk',
        title: 'Cảnh báo rủi ro cạnh tranh',
        desc: `${r.title} • Mức độ: ${r.severity === 'high' ? 'Cao' : r.severity === 'medium' ? 'Trung bình' : 'Thấp'}`,
        timestamp: r.createdAt.toISOString(),
        link: '/wf08',
        severity: 'high'
      });
    }

    // 4. Báo cáo chiến lược (Reports)
    for (const rp of reports) {
      notifications.push({
        id: `report-${rp.id}`,
        type: 'report',
        title: 'Báo cáo chiến lược mới',
        desc: rp.title,
        timestamp: rp.generatedAt.toISOString(),
        link: '/wf09',
        severity: 'info'
      });
    }

    // 5. Xu hướng thị trường (Trends)
    for (const t of trends) {
      notifications.push({
        id: `trend-${t.id}`,
        type: 'trend',
        title: 'Xu hướng thị trường mới',
        desc: `Chủ đề: ${t.name} (Điểm: ${t.score})`,
        timestamp: t.detectedAt.toISOString(),
        link: '/wf06',
        severity: 'info'
      });
    }

    // 6. Nội dung mới từ đối thủ (Social Contents)
    for (const c of contents) {
      notifications.push({
        id: `content-${c.id}`,
        type: 'content',
        title: `Video mới từ ${c.competitor?.name || 'Đối thủ'}`,
        desc: c.title,
        timestamp: c.createdAt.toISOString(),
        link: '/wf02',
        severity: 'info'
      });
    }

    // Sắp xếp thời gian giảm dần (mới nhất lên đầu)
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Giới hạn 20 thông báo mới nhất
    const limitedNotifications = notifications.slice(0, 20);

    return res.json({
      success: true,
      count: limitedNotifications.length,
      data: limitedNotifications
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch notifications'
    });
  }
});

export default router;
