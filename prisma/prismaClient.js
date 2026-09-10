const { PrismaClient } = require("@prisma/client");
let prisma;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL in environment. Set DATABASE_URL to connect to Postgres.",
  );
}

try {
  const { PrismaPg } = require("@prisma/adapter-pg");
  const adapter = new PrismaPg({ connectionString });
  prisma = new PrismaClient({ adapter });
} catch (err) {
  // If adapter package is not installed or fails, surface a clear error
  throw new Error(
    "Failed to initialize Prisma adapter. Ensure @prisma/adapter-pg is installed. " +
      err.message,
  );
}

module.exports = prisma;