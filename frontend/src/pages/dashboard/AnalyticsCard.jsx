import React from "react";
import { motion } from "framer-motion";

const AnalyticsCard = ({ title, value, subtitle, color }) => {
  return (
    <>
      <motion.div
        whileHover={{
          scale: 1.03,
        }}
        className="bg-white rounded-xl shadow-sm border/80 border-[#1fc29f] p-5 hover:shadow-md transition"
      >
        <p className="text-sm text-gray-500">{title}</p>

        <h2 className="text-3xl font-bold text-gray-800 mt-2">{value}</h2>

        {subtitle && <p className={`text-sm mt-2 ${color}`}>{subtitle}</p>}
      </motion.div>
    </>
  );
};

export default AnalyticsCard;
