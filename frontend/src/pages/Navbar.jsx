import React, { useContext } from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext }from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useContext(AuthContext);
  if (loading) return null;
  console.log(user);

  return (
    <>
      <div className="h-full w-full pt-10 pb-5 px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold sm:ml-20 mb-4 sm:mb-0">
          <Link to="/" className="h-full w-full">
            ExpensifyX
          </Link>
        </h1>

        <div className="sm:mr-20 flex flex-row">
          
          {user ? (
            <button
              className="text-base font-medium mr-3 bg-[#1fc29f] text-white/80 py-3.5 px-4.5 rounded-lg"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
