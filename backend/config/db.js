// import { PrismaClient } from "../src/generated/prisma/index.js";

// const PORT = process.env.PORT || 3000;

// async function startServer() {
//   try {
//     // lightweight readiness check
//     await prisma.$queryRaw`SELECT 1`;
//     console.log("✅ Database ready");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("❌ Database not reachable", error);
//     process.exit(1);
//   }
// }

// startServer();

// import { PrismaClient } from "../src/generated/prisma/index.js";

// const prisma = new PrismaClient({
//   log: ["error", "warn"],
// });

import { PrismaClient } from "../src/generated/prisma/index.js";

export const prisma = new PrismaClient({
  log: ["error", "warn"],
});

// const connectDB = async () => {
//   try {
//     await prisma.$connect();
//     console.log("✅ Database connected successfully");
//   } catch (err) {
//     console.error("❌ Database connection failed:", err);
//   }
// };

// export { connectDB };
