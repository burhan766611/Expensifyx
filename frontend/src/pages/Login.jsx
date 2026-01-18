import { useContext, useState } from "react";
import g from "/google.png";
import eye from "/eye.png";
import hide from "/hide.png";
import api from "../api/axios.js";
import Navbar from "../pages/Navbar.jsx";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isPassword, setIsPassword] = useState(false);
  const [credential, setCredential] = useState(false);
  const [errMsg, setErrMsg] = useState();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const params = new URLSearchParams(location.search);
  const inviteToken = params.get("invite");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const payload = {
    ...loginData,
    inviteToken: inviteToken || undefined,
  };

  const handleSubmit = async (e) => {
    console.log("hii");
    e.preventDefault();
    console.log(inviteToken);
    // if (inviteToken) {
    //   setLoginData((prevData) => ({ ...prevData, inviteToken: inviteToken }));
    console.log("hii 1");
    console.log(loginData);
    try {
      const response = await api.post("/auth/login", payload);
      console.log(response.data);
      setUser(response.data.user);
      setCredential(false);
      navigate("/dash");
    } catch (err) {
      console.log(err.response.data.message);
      setCredential(true);
      setErrMsg(err.response.data.message);
    } finally {
      setLoginData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full h-full bg-[url(/bg.png)] pb-2">
        <div className="my-5 flex justify-center items-center px-4 sm:px-0">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl px-6 sm:px-18 py-8 sm:py-10 bg-white shadow-xl 
                   w-full sm:w-[70%] lg:w-[45%]"
          >
            <h1 className="text-2xl sm:text-3xl font-light mb-8 sm:mb-10">
              Log in
            </h1>

            <label htmlFor="email" className="font-light tracking-wide">
              Email address
            </label>
            <motion.input
              initial={{
                x: 0,
              }}
              whileFocus={{
                boxShadow: "0 0 0 2px rgba(31,194,159,0.45)",
                borderColor: "#1fc29f",
              }}
              whileHover={{
                x: 5,
                borderColor: "#1fc29f",
              }}
              transition={{
                type: "spring",
              }}
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
              className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-5 
                     text-base sm:text-lg font-light
                     outline-none focus:outline-none focus:ring-0 appearance-none"
            />

            <label htmlFor="email" className="font-light tracking-wide">
              Password
            </label>

            <div className="relative">
              <motion.input
                initial={{
                  x: 0,
                }}
                whileFocus={{
                  boxShadow: "0 0 0 2px rgba(31,194,159,0.45)",
                  borderColor: "#1fc29f",
                }}
                whileHover={{
                  x: 5,
                  borderColor: "#1fc29f",
                }}
                transition={{
                  type: "spring",
                }}
                type={isPassword ? "text" : "password"}
                id="password"
                name="password"
                minLength={6}
                value={loginData.password}
                onChange={handleChange}
                required
                className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 
                       text-base sm:text-lg font-light
                       outline-none focus:outline-none focus:ring-0 appearance-none"
              />
              <img
                className="h-6 sm:h-7 absolute right-3 top-3"
                onClick={() => {
                  setIsPassword(!isPassword);
                }}
                src={isPassword ? eye : hide}
                alt=""
              />
              {credential ? (
                <p className=" m-1 text-red-500 text-xs">{errMsg}</p>
              ) : (
                ""
              )}
            </div>

            <motion.button
              initial={{ scaleY: 1 }}
              whileHover={{ scaleY: 1.05 }}
              transition={{ type: "spring" }}
              type="submit"
              className="bg-[#1fc29f] p-2 text-white font-bold rounded-sm 
                     w-full mt-8 sm:mt-10 cursor-pointer"
            >
              Log in
            </motion.button>

            <p className="text-gray-400 text-center mt-8 sm:mt-10 mb-4 sm:mb-5">
              ----- or -----
            </p>

            <motion.button
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring" }}
              type="submit"
              className="font-medium text-base sm:text-lg text-center border py-2 
                     w-full rounded-lg cursor-pointer flex flex-row justify-center 
                     items-center bg-white border-gray-400/50"
            >
              <img className="h-5 sm:h-6 mr-2" src={g} alt="" />
              <span>Sign in with Google</span>
            </motion.button>
          </form>
        </div>
      </div>
    </>
  );
}

// <>
//   <div className="w-full h-full bg-[url(/bg.png)] pb-2">
//     <div className="my-5 flex justify-center items-center">
//       <form
//         onSubmit={handleSubmit}
//         className="rounded-2xl px-18 py-10 bg-white shadow-xl w-[45%] "
//       >
//         <h1 className="text-3xl font-light mb-10">Log in</h1>
//         <label htmlFor="email" className="font-light tracking-wide">
//           Email address
//         </label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={loginData.email}
//           onChange={handleChange}
//           className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-5 text-lg font-light "
//         />

//         <label htmlFor="email" className="font-light tracking-wide">
//           Password
//         </label>

//         <div className="relative">
//           <input
//             type={isPassword ? "text" : "password"}
//             id="password"
//             name="password"
//             value={loginData.password}
//             onChange={handleChange}
//             className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 text-lg font-light"
//           ></input>
//           <img
//             className="h-7 absolute right-3 top-3.5"
//             onClick={() => {
//               setIsPassword(!isPassword);
//             }}
//             src={isPassword ? eye : hide}
//             alt=""
//           />
//         </div>

//         <motion.button
//           initial={{
//             scaleY: 1,
//           }}
//           whileHover={{
//             scaleY: 1.05,
//           }}
//           transition={{
//             type: "spring",
//           }}
//           type="submit"
//           className="bg-[#1fc29f] p-2 text-white font-bold rounded-sm w-full mt-10 cursor-pointer"
//         >
//           Log in
//         </motion.button>

//         <p className="text-gray-400 text-center mt-10 mb-5">
//           ----- or -----
//         </p>
//         <motion.button
//           initial={{
//             scale: 1,
//           }}
//           whileHover={{
//             scale: 1.03,
//           }}
//           transition={{
//             type: "spring",
//           }}
//           type="submit"
//           className="font-medium text-lg text-center border py-2 w-full rounded-lg cursor-pointer flex flex-row justify-center items-center bg-white border-gray-400/50"
//         >
//           <img className="h-6 mr-2" src={g} alt="" />
//           <span>Sign in with Google</span>
//         </motion.button>
//       </form>
//     </div>
//   </div>
// </>

//bg-[#1fc29f]