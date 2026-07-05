const { PrismaClient } = require("../../generated/prisma");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

let prisma;

if (!global.prisma) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  global.prisma = new PrismaClient({ adapter });
}
prisma = global.prisma;

module.exports = prisma;
