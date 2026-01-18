import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import eye from "/eye.png";
import hide from "/hide.png";
import Navbar from "../pages/Navbar.jsx";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isPassword, setIsPassword] = useState(false);
  const [credential, setCredential] = useState(false);
  const [errMsg, setErrMsg] = useState();
  const [signUpData, setsignUpData] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
  });
  const params = new URLSearchParams(location.search);
  const inviteToken = params.get("invite");

  const handleChange = (e) => {
    setsignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const payload = {
    ...signUpData,
    inviteToken: inviteToken || undefined,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //     if (inviteToken) {
    //   setsignUpData((prevData) => ({ ...prevData, inviteToken: inviteToken }));
    // }
    console.log(signUpData);
    try {
      const response = await api.post("/auth/register", payload);
      console.log(response.data);
      setUser(response.data.user);
      setCredential(false);
      navigate("/dash");
    } catch (err) {
      console.log(err.response?.data);
      setCredential(true);
      setErrMsg(err.response.data.message);
    } finally {
      setsignUpData({
        name: "",
        email: "",
        password: "",
        organizationName: "",
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
            <h1
              className="text-2xl text-black sm:text-3xl font-light mb-8 sm:mb-10"
            >
              Sign up
            </h1>

            <label htmlFor="email" className="font-light tracking-wide">
              Name
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
              type="text"
              id="name"
              name="name"
              minLength={2}
              value={signUpData.name}
              onChange={handleChange}
              required
              className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-5 
                     text-base sm:text-lg font-light outline-none focus:outline-none focus:ring-0 appearance-none"
            />

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
              value={signUpData.email}
              onChange={handleChange}
              required
              className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-5 
                     text-base sm:text-lg font-light outline-none focus:outline-none focus:ring-0 appearance-none"
            />

            <label htmlFor="email" className="font-light tracking-wide">
              Password
            </label>

            <div className="relative mb-4">
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
                value={signUpData.password}
                onChange={handleChange}
                required
                className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 
                       text-base sm:text-lg font-light outline-none focus:outline-none focus:ring-0 appearance-none"
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
            <label htmlFor="email" className="font-light tracking-wide">
              Organization Name
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
              type="text"
              id="orgName"
              name="organizationName"
              value={signUpData.organizationName}
              onChange={handleChange}
              required
              className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-5 
                     text-base sm:text-lg font-light outline-none focus:outline-none focus:ring-0 appearance-none"
            />

            <motion.button
              initial={{ scaleY: 1 }}
              whileHover={{ scaleY: 1.05 }}
              transition={{ type: "spring" }}
              type="submit"
              className="bg-[#1fc29f] p-2 text-white font-bold rounded-sm 
                     w-full mt-8 sm:mt-10 cursor-pointer"
            >
              Sign up
            </motion.button>

            
          </form>
        </div>
      </div>
    </>
  );
}

{/* <p className="text-gray-400 text-center mt-8 sm:mt-10 mb-4 sm:mb-5">
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
            </motion.button> */}