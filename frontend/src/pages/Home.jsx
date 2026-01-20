import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import travel from "/aircraft.png";
import crowd from "/people.png";
import heart from "/heart.png";
import home from "/home.png";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();

  const arr = [
    "With Homies",
    "On Trips",
    "With your partner",
    "With anyones",
    "With housemates",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % arr.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [arr.length]);

  return (
    <>
      <Navbar />
      <div className="h-full w-full bg-white overflow-x-hidden ">
        <div className="h-full w-full text-gray-700/90">
          {/* NAVBAR */}
          {/* <div className="h-full w-full pt-10 pb-5 px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold sm:ml-20 mb-4 sm:mb-0">
              <Link to="/" className="h-full w-full">
                ExpensifyX
              </Link>
            </h1>

            <div className="sm:mr-20 flex flex-row">
              <Link
                to="/login"
                className="text-base font-medium px-4 py-2 mr-2 rounded-lg"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => {
                  navigate("/register");
                }}
                className="text-base font-medium mr-3 bg-[#1fc29f] text-white/80 py-3.5 px-4.5 rounded-lg"
              >
                Sign up
              </Link>
            </div>
          </div> */}

          {/* HERO */}
          <div className="h-full w-full p-6 sm:p-20 pt-5 sm:pt-20 bg-[url(/b1.png)]">
            <div className="h-full w-full px-0 sm:px-20 flex flex-col lg:flex-row gap-10 lg:gap-30  ">
              {/* LEFT */}
              <div className="pr-0 sm:pr-3">
                <p className="text-3xl sm:text-5xl leading-tight sm:leading-14 font-bold">
                  Less stress when sharing expenses
                </p>

                <p className="text-3xl sm:text-5xl my-4 font-bold text-[#1fc29f]">
                  {arr[index]}
                </p>

                <div className="flex flex-wrap sm:flex-row">
                  <img src={travel} className="h-10 sm:h-12 m-3" />
                  <img src={heart} className="h-10 sm:h-12 m-3" />
                  <img src={home} className="h-10 sm:h-12 m-3" />
                  <img src={crowd} className="h-10 sm:h-12 m-3" />
                </div>

                <p className="text-base sm:text-lg my-1">
                  Keep track of your shared expenses and balances with
                  housemates, trips, groups, friends, and family.
                </p>

                <motion.div
                  initial={{ scaleY: 1 }}
                  whileHover={{ scaleY: 1.05 }}
                  transition={{ type: "spring" }}
                  className="mt-8"
                >
                  <Link
                    to="/register"
                    onClick={() => {
                      navigate("/register");
                    }}
                    className="text-lg font-medium mr-3 bg-[#1fc29f] text-white/80 py-4.5 px-15 rounded-lg block w-full sm:inline-block text-center"
                  >
                    Sign up
                  </Link>
                </motion.div>
              </div>

              {/* RIGHT */}

              {/* <p className="text-5xl font-bold">
                  Less stress when sharing expenses
                </p> */}
              {/* <div className="hidden lg:block">
                <div className="h-full w-full">
                  <div className="h-full">
                    <div className=" h-full w-full flex justify-between items-center">
                      <img
                        src="/dashboard.png"
                        className="h-50 rounded-2xl p-1 shadow-2xl rotate-12"
                      />
                      <div className="h-full w-full">
                        <img
                          src="/expense.png"
                          className=" rounded-2xl shadow-2xl -rotate-12 "
                        />
                        <img
                          src="/invitepanel.png"
                          className="h-60 rounded-2xl shadow-2xl rotate-17 mt-5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* RIGHT */}
              <div className="w-full h-full lg:w-1/2 flex justify-center items-center md:mt-10 lg:mt-25 sm: mt-5">
                <div className="relative flex flex-col sm:flex-row gap-6 sm:gap-10 items-center justify-center">
                  {/* Dashboard */}
                  <motion.img
                    initial={{
                      rotate: 12,
                    }}
                    whileHover={{
                      rotate: 0,
                    }}
                    src="/expense.png"
                    className="w-[60%] shadow-2xl rounded-2xl lg:mb-15"
                    alt=""
                  />
                  <motion.img
                    initial={{
                      rotate: -15,
                    }}
                    whileHover={{
                      rotate: 0,
                    }}
                    src="/invitepanel.png"
                    className="w-[60%] rounded-2xl shadow-2xl mt-15"
                  />
                </div>
              </div>
            </div>
            <div className="p-30"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

// <>
//   <div className="h-full w-full bg-white">
//     <div className="h-full w-full  text-gray-700/90">
//       <div className="h-full w-full pt-10 pb-5 px-10 flex flex-row justify-between">
//         <h1 className="text-2xl font-bold ml-20">
//           <Link to="/" className="h-full w-full">
//             ExpensifyX
//           </Link>
//         </h1>
//         <div className=" mr-20">
//           <Link
//             to="/login"
//             className="text-base font-medium px-4 py-2 mr-2 rounded-lg "
//           >
//             Log in
//           </Link>
//           <Link
//             to="/register"
//             onClick={() => {
//               navigate("/register");
//             }}
//             className="text-base font-medium mr-3 bg-[#1fc29f] text-white/80 py-3.5 px-4.5 rounded-lg "
//           >
//             Sign up
//           </Link>
//         </div>
//       </div>
//       <div className="h-full w-full p-20 pt-30 bg-[url(/bg.png)] ">
//         <div className="h-full w-full px-20 flex gap-30 flex-row">
//           <div className="pr-3">
//             <p className="text-5xl leading-14 font-bold">
//               Less stress when sharing expenses
//             </p>
//             <p className="text-5xl my-4 font-bold text-[#1fc29f]">
//               {arr[index]}
//             </p>
//             <div className="flex flex-row">
//               <img src={travel} className="h-12 m-3"></img>
//               <img src={heart} className="h-12 m-3 "></img>
//               <img src={home} className="h-12 m-3"></img>
//               <img src={crowd} className="h-12 m-3"></img>
//             </div>
//             <p className="text-lg my-1">
//               Keep track of your shared expenses and balances with
//               housemates, trips, groups, friends, and family.
//             </p>
//             <motion.div
//               initial={{
//                 scaleY: 1,
//               }}
//               whileHover={{
//                 scaleY: 1.05,
//               }}
//               transition={{
//                 type: "spring"
//               }}
//               className="mt-8"
//             >
//               <Link
//                 to="/register"
//                 onClick={() => {
//                   navigate("/register");
//                 }}
//                 className="text-lg font-medium mr-3 bg-[#1fc29f] text-white/80 py-4.5 px-15  rounded-lg "
//               >
//                 Sign up
//               </Link>
//             </motion.div>
//           </div>
//           <div>
//             <p className="text-5xl font-bold">
//               Less stress when sharing expenses
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="h-full w-full flex flex-row bg-[url(/bg.png)] ">
//         <div className="px-20 py-15 h-full w-[30%] bg-gray-700/80">
//             <p className="text-lg text-white font-light ">
//                 Trusted by 1000 of users across countries.
//             </p>
//         </div>
//         <motion.div
//         initial={{
//             x:0,
//             scale: 1
//         }}
//         whileHover={{
//             x: -70,
//             scale: 1.05
//         }}
//         transition={{
//             type: "tween",
//             duration: 5
//         }}
//         className="w-full flex flex-row py-15 bg-[#1fc29f]">
//             <p className="text-base font-bold mr-20">John Doe</p>
//             <p className="text-base font-bold mr-20">John Doe</p>
//             <p className="text-base font-bold mr-20">John Doe</p>
//             <p className="text-base font-bold mr-20">John Doe</p>
//             <p className="text-base font-bold mr-20">John Doe</p>
//         </motion.div>
//       </div>
//     </div>
//   </div>
// {/* <div className="border-2 border-[#1fc29f] rounded-2xl mt-30">
//   <motion.img
//     whileHover={{
//       scale: 1.1
//     }}
//     transition={{
//       type: "spring"
//     }}
//     src="dashboard.png"
//     alt=""
//     className="rounded-2xl shadow-2xl  p-2"
//   />
// </div>
// </>
