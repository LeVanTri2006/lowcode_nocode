-- CreateTable
CREATE TABLE "ai_analyses" (
    "id" SERIAL NOT NULL,
    "content_id" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "keywords" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "key_message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_analyses_content_id_key" ON "ai_analyses"("content_id");

-- AddForeignKey
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "social_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
