-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "tutorProfileId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "TutorProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_applicationId_key" ON "Review"("applicationId");

-- CreateIndex
CREATE INDEX "Review_tutorProfileId_idx" ON "Review"("tutorProfileId");

-- CreateIndex
CREATE INDEX "Review_authorId_idx" ON "Review"("authorId");
