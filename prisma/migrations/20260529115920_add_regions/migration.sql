-- CreateTable
CREATE TABLE "TutorRegion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tutorProfileId" TEXT NOT NULL,
    "regionName" TEXT NOT NULL,
    CONSTRAINT "TutorRegion_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "TutorProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RequirementRegion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requirementId" TEXT NOT NULL,
    "regionName" TEXT NOT NULL,
    CONSTRAINT "RequirementRegion_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TutorRegion_regionName_idx" ON "TutorRegion"("regionName");

-- CreateIndex
CREATE UNIQUE INDEX "TutorRegion_tutorProfileId_regionName_key" ON "TutorRegion"("tutorProfileId", "regionName");

-- CreateIndex
CREATE INDEX "RequirementRegion_regionName_idx" ON "RequirementRegion"("regionName");

-- CreateIndex
CREATE UNIQUE INDEX "RequirementRegion_requirementId_regionName_key" ON "RequirementRegion"("requirementId", "regionName");
