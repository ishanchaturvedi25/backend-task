const prismaClient = require('../prisma/prismaClient');

async function connectDB() {
  try {
    await prismaClient.$connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

module.exports = { prismaClient, connectDB };