-- CreateTable: competitors
CREATE TABLE "competitors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "competitors_platform_channel_id_key"
ON "competitors"("platform", "channel_id");

-- CreateTable: social_contents
CREATE TABLE "social_contents" (
    "id" SERIAL NOT NULL,
    "competitor_id" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "social_contents_platform_content_id_key"
ON "social_contents"("platform", "content_id");

-- CreateTable: social_metrics
CREATE TABLE "social_metrics" (
    "id" SERIAL NOT NULL,
    "content_id" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER,
    "captured_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "social_metrics_content_id_idx"
ON "social_metrics"("content_id");

CREATE INDEX "social_metrics_captured_at_idx"
ON "social_metrics"("captured_at");

-- AddForeignKey
ALTER TABLE "social_contents"
ADD CONSTRAINT "social_contents_competitor_id_fkey"
FOREIGN KEY ("competitor_id") REFERENCES "competitors"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "social_metrics"
ADD CONSTRAINT "social_metrics_content_id_fkey"
FOREIGN KEY ("content_id") REFERENCES "social_contents"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
