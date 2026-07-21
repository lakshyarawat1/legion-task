import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const tasks = await prisma.task.findMany();
  console.log(`Total tasks in DB: ${tasks.length}`);
  if (tasks.length > 0) {
    const firstProject = tasks[0].projectId;
    const projectTasks = tasks.filter(t => t.projectId === firstProject);
    console.log(`Tasks for projectId ${firstProject}: ${projectTasks.length}`);
    
    // Now let's try querying using the exact query from TaskController
    const queriedTasks = await prisma.task.findMany({
      where: {
        projectId: String(firstProject)
      }
    });
    console.log(`Tasks returned when filtered by projectId in Prisma: ${queriedTasks.length}`);
    
    // Test if other projects somehow get included
    const otherProjects = queriedTasks.filter(t => t.projectId !== firstProject);
    console.log(`Other projects returned? ${otherProjects.length > 0 ? "YES" : "NO"}`);
  }
}
check().finally(() => prisma.$disconnect());
