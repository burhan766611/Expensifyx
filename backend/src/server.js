import app from './app.js';
import { prisma } from '../config/db.js';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // lightweight DB readiness check
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database ready');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database not reachable', error);
    process.exit(1);
  }
};

startServer();


// import { connectDB } from '../config/db.js';
// import app from './app.js';
// import dotenv from 'dotenv/config';


// const PORT = process.env.PORT || 3000;

// // const startServer = async () => {
// //     await connectDB();

// //     app.listen(PORT, ()=> {
// //         console.log(`Server running on port ${PORT}`)
// //     })
// // }

// const startServer = async () => {
//   try {
//     // lightweight DB readiness check
//     await prisma.$queryRaw`SELECT 1`;
//     console.log("✅ Database ready");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("❌ Database not reachable", error);
//     process.exit(1);
//   }
// };

// startServer();