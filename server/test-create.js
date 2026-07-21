const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    await prisma.project.create({ data: { name: 'Test', orgId: null } });
    console.log('Success');
  } catch(e) {
    console.error(e);
  }
}
test().finally(() => prisma.$disconnect());
