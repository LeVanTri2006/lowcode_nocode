-- CreateTable
CREATE TABLE "monitoring_alerts" (
    "id" SERIAL NOT NULL,
    "content_id" INTEGER NOT NULL,
    "competitor_id" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "alert_type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "views_change" INTEGER NOT NULL,
    "likes_change" INTEGER NOT NULL,
    "comments_change" INTEGER NOT NULL,
    "views_growth_rate" DOUBLE PRECISION NOT NULL,
    "likes_growth_rate" DOUBLE PRECISION NOT NULL,
    "comments_growth_rate" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monitoring_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "monitoring_alerts_content_id_idx" ON "monitoring_alerts"("content_id");

-- CreateIndex
CREATE INDEX "monitoring_alerts_competitor_id_idx" ON "monitoring_alerts"("competitor_id");

-- AddForeignKey
ALTER TABLE "monitoring_alerts" ADD CONSTRAINT "monitoring_alerts_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "social_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoring_alerts" ADD CONSTRAINT "monitoring_alerts_competitor_id_fkey" FOREIGN KEY ("competitor_id") REFERENCES "competitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
