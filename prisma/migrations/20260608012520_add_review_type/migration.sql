-- AlterTable
ALTER TABLE "Review" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'GOAL_WEEKLY';

-- CreateIndex
CREATE INDEX "Review_type_idx" ON "Review"("type");
