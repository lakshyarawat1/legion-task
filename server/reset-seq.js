const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = ['Team', 'Project', 'ProjectTeam', 'Task', 'TaskAssignment', 'Attachment', 'Comment', 'Organization'];
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`SELECT setval('"${table}_id_seq"', (SELECT MAX(id) FROM "${table}"));`);
      console.log('Reset sequence for ' + table);
    } catch (e) {
      console.error('Failed to reset ' + table + ':', e.message);
    }
  }
  
  try {
    await prisma.$executeRawUnsafe(`SELECT setval('"User_userId_seq"', (SELECT MAX("userId") FROM "User"));`);
    console.log('Reset sequence for User');
  } catch (e) {
    console.error('Failed to reset User:', e.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
