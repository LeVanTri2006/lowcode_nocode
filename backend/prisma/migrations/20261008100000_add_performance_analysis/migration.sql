-- CreateTable
CREATE TABLE "performance_analyses" (
    "id" SERIAL NOT NULL,
    "competitor_id" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "video_count" INTEGER NOT NULL,
    "total_views" INTEGER NOT NULL,
    "total_likes" INTEGER NOT NULL,
    "total_comments" INTEGER NOT NULL,
    "total_engagement" INTEGER NOT NULL,
    "average_views" DOUBLE PRECISION NOT NULL,
    "average_likes" DOUBLE PRECISION NOT NULL,
    "average_comments" DOUBLE PRECISION NOT NULL,
    "engagement_rate" DOUBLE PRECISION NOT NULL,
    "average_like_rate" DOUBLE PRECISION NOT NULL,
    "average_comment_rate" DOUBLE PRECISION NOT NULL,
    "performance_rank" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "performance_analyses_competitor_id_platform_key" ON "performance_analyses"("competitor_id", "platform");

-- AddForeignKey
ALTER TABLE "performance_analyses" ADD CONSTRAINT "performance_analyses_competitor_id_fkey" FOREIGN KEY ("competitor_id") REFERENCES "competitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
