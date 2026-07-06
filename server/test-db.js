require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.$connect()
  .then(() => {
    console.log('Successfully connected to the database.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Failed to connect to the database. Error details:');
    console.error(e);
    process.exit(1);
  });
