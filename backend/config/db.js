import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
};

export { prisma, connectDB };
