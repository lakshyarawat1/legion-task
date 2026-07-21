import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generatePrefix(name: string): string {
  if (!name) return "PRJ";
  const words = name.split(/[\s_-]+/);
  let prefix = words
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  if (prefix.length === 0) return "PRJ";
  if (prefix.length > 5) prefix = prefix.substring(0, 5);
  return prefix;
}

async function backfill() {
  console.log("Starting data backfill for ARCH-002...");

  // 1. Backfill Projects with prefix
  const projects = await prisma.project.findMany();
  for (const project of projects) {
    let prefix = generatePrefix(project.name);

    // Handle org-level collisions
    let isUnique = false;
    let suffix = 1;
    let finalPrefix = prefix;

    while (!isUnique) {
      const existing = await prisma.project.findFirst({
        where: {
          orgId: project.orgId,
          prefix: finalPrefix,
          id: { not: project.id },
        },
      });

      if (!existing) {
        isUnique = true;
      } else {
        suffix++;
        finalPrefix = `${prefix.substring(0, 4)}${suffix}`;
      }
    }

    await prisma.project.update({
      where: { id: project.id },
      data: { prefix: finalPrefix },
    });
    console.log(`Assigned prefix ${finalPrefix} to project ${project.name}`);
  }

  // 2. Backfill Tasks with taskNumber
  for (const project of projects) {
    const tasks = await prisma.task.findMany({
      where: { projectId: project.id },
      orderBy: { id: "asc" }, // Stable order
    });

    for (let i = 0; i < tasks.length; i++) {
      await prisma.task.update({
        where: { id: tasks[i].id },
        data: { taskNumber: i + 1 },
      });
      console.log(
        `Assigned taskNumber ${i + 1} to task ${tasks[i].id} in project ${
          project.name
        }`
      );
    }
  }

  console.log("Backfill completed successfully!");
}

backfill()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
