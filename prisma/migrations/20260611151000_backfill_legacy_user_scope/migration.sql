-- Scheme B: preserve existing rows by assigning them to a stable legacy user.
-- The user is intentionally not linked to a GitHub account because provider
-- account ids are only known after OAuth login.

INSERT INTO "User" (
    "id",
    "name",
    "email",
    "emailVerified",
    "image",
    "createdAt",
    "updatedAt"
)
VALUES (
    'legacy-default-user',
    'Legacy Imported User',
    'legacy-default-user@plan.local',
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO UPDATE SET
    "updatedAt" = CURRENT_TIMESTAMP;

UPDATE "Goal"
SET "userId" = 'legacy-default-user'
WHERE "userId" IS NULL;

UPDATE "Task"
SET "userId" = COALESCE(
    (
        SELECT "Goal"."userId"
        FROM "Goal"
        WHERE "Goal"."id" = "Task"."goalId"
    ),
    'legacy-default-user'
)
WHERE "userId" IS NULL;

UPDATE "Review"
SET "userId" = COALESCE(
    (
        SELECT "Goal"."userId"
        FROM "Goal"
        WHERE "Goal"."id" = "Review"."goalId"
    ),
    'legacy-default-user'
)
WHERE "userId" IS NULL;

ALTER TABLE "Goal" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Task" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Review" ALTER COLUMN "userId" SET NOT NULL;
