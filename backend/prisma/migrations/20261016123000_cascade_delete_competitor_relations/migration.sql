-- DropForeignKey
ALTER TABLE "social_contents" DROP CONSTRAINT "social_contents_competitor_id_fkey";

-- DropForeignKey
ALTER TABLE "social_metrics" DROP CONSTRAINT "social_metrics_content_id_fkey";

-- DropForeignKey
ALTER TABLE "ai_analyses" DROP CONSTRAINT "ai_analyses_content_id_fkey";

-- DropForeignKey
ALTER TABLE "performance_analyses" DROP CONSTRAINT "performance_analyses_competitor_id_fkey";

-- DropForeignKey
ALTER TABLE "monitoring_alerts" DROP CONSTRAINT "monitoring_alerts_content_id_fkey";

-- DropForeignKey
ALTER TABLE "monitoring_alerts" DROP CONSTRAINT "monitoring_alerts_competitor_id_fkey";

-- AddForeignKey
ALTER TABLE "social_contents" ADD CONSTRAINT "social_contents_competitor_id_fkey" FOREIGN KEY ("competitor_id") REFERENCES "competitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_metrics" ADD CONSTRAINT "social_metrics_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "social_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "social_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_analyses" ADD CONSTRAINT "performance_analyses_competitor_id_fkey" FOREIGN KEY ("competitor_id") REFERENCES "competitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoring_alerts" ADD CONSTRAINT "monitoring_alerts_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "social_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoring_alerts" ADD CONSTRAINT "monitoring_alerts_competitor_id_fkey" FOREIGN KEY ("competitor_id") REFERENCES "competitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
