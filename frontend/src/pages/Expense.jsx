import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import TopBar from "./dashboard/TopBar";
import InviteMemberPanel from "./Invite/InviteMemberPanel";
import { useNavigate } from "react-router-dom";

const Expense = () => {
  const navigate = useNavigate();
  const [expenseData, setExpenseData] = useState({
    amount: "",
    category: "",
    description: "",
    recieptUrl: "",
  });
  const [inviteOpen, setInviteOpen] = useState(false);

  // const [inviteData, setInviteData] = useState({
  //   email: "",
  //   role: "",
  // });

  const [recieptFile, setRecieptFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChangeExpense = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  // const handleChangeInvite = (e) => {
  //   setInviteData({ ...inviteData, [e.target.name]: e.target.value });
  // };

  const uploadReceiptToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "expensify");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxdmv1elz/raw/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }
    console.log("Cloudinary Response data :", data);
    console.log("Cloudinary data secure url : ", data.secure_url);
    return data.secure_url;
  };


  const handleExpense = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      let receiptUrl;

      if (recieptFile) {
        receiptUrl = await uploadReceiptToCloudinary(recieptFile);
      }

      const payload = {
        amount: Number(expenseData.amount),
        category: expenseData.category.trim(),
      };

      if (expenseData.description.trim()) {
        payload.description = expenseData.description.trim();
      }

      if (receiptUrl) {
        payload.receiptUrl = receiptUrl; // ✅ CORRECT KEY
      }

      console.log("FINAL PAYLOAD:", payload);

      const res = await api.post("/expenses", payload);
      console.log(res.data);
      navigate("/dash");
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setExpenseData({
        amount: "",
        category: "",
        description: "",
      });
      setRecieptFile(null);
      setUploading(false);
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG and PNG images are allowed");
      return;
    }

    setRecieptFile(file);
  };

  return (
    <>
      {/* <TopBar onInvite={handleInvite} /> */}
      <TopBar onInvite={() => setInviteOpen(true)} />
      <InviteMemberPanel
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={() => {
          // optional: toast / refetch
        }}
      />
      <div className="h-full w-full bg-[url(/bg.png)] ">
        <div
          className="h-screen w-screen flex flex-col lg:flex-row justify-center 
                 gap-10 lg:gap-40 items-center px-5 sm:px-10 lg:px-20 py-5"
        >
          {/* ADD EXPENSE */}
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring" }}
            className="bg-white shadow-2xl px-6 sm:px-12 pt-10 sm:pt-15 
                   rounded-2xl w-full sm:w-[85%] lg:w-auto"
          >
            <motion.h1
              whileHover={{ color: "#1fc29f" }}
              className="text-2xl sm:text-3xl font-bold text-center text-gray-700"
            >
              Add Expense
            </motion.h1>

            <form
              onSubmit={handleExpense}
              className="px-3 sm:px-7 py-10 rounded-sm"
            >
              <motion.div
                whileTap={{
                  y: -10,
                }}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                }}
                className="my-3"
              >
                <label
                  htmlFor="amount"
                  className="text-lg font-light tracking-wide"
                >
                  {" "}
                  Amount{" "}
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={expenseData.amount}
                  onChange={handleChangeExpense}
                  required
                  placeholder="200inr"
                  className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-2
                     text-base  [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </motion.div>
              <motion.div
                whileTap={{
                  y: -10,
                }}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                }}
                className="my-3"
              >
                <label
                  htmlFor="category"
                  className="text-lg font-light tracking-wide"
                >
                  {" "}
                  Category{" "}
                </label>
                <input
                  id="category"
                  type="text"
                  name="category"
                  value={expenseData.category}
                  onChange={handleChangeExpense}
                  required
                  placeholder="Food | Travel"
                  className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-2 "
                />
              </motion.div>
              <motion.div
                whileTap={{
                  y: -10,
                }}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                }}
                className="my-3"
              >
                <label
                  htmlFor="description"
                  className="text-lg font-light tracking-wide"
                >
                  {" "}
                  Description{" "}
                </label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  value={expenseData.description}
                  onChange={handleChangeExpense}
                  required
                  placeholder="For help "
                  className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-2 "
                />
              </motion.div>
              <motion.div
                whileTap={{
                  y: -10,
                }}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                }}
                className="my-3"
              >
                <label
                  htmlFor="recieptUrl"
                  className="text-lg font-light tracking-wide"
                >
                  {" "}
                  Reciept{" "}
                </label>
                <input
                  type="file"
                  key={recieptFile ? "has-file" : "no-file"}
                  accept="image/jpeg,image/pdf"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-5 "
                />
              </motion.div>
              <motion.button
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring" }}
                disabled={uploading}
                type="submit"
                className={`p-2 py-3 mt-5 w-full rounded-lg text-xl text-white
    ${uploading ? "bg-gray-400" : "bg-[#1fc29f]"}`}
              >
                {uploading ? "Uploading..." : "Add Expense"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Expense;

// const handleExpense = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setUploading(true);

  //     let receiptUrl;

  //     if (recieptFile) {
  //       receiptUrl = await uploadReceiptToCloudinary(recieptFile);
  //     }
  //     console.log(receiptUrl);

  //     const payload = {
  //       amount: Number(expenseData.amount),
  //       category: expenseData.category.trim(),
  //     };

  //     if (expenseData.description.trim()) {
  //       payload.description = expenseData.description.trim();
  //     }

  //     if (receiptUrl) {
  //       payload.receiptUrl = receiptUrl;
  //     }
  //     console.log(receiptUrl);

  //     console.log(payload);

  //     const res = await api.post("/expenses", payload, {
  //       withCredentials: true,
  //     });

  //     console.log(res.data);

  //     setRecieptFile(null);
  //   } catch (err) {
  //     console.log(err.response?.data || err);
  //   } finally {
  //     setExpenseData({
  //       amount: "",
  //       category: "",
  //       description: "",
  //     });
  //     setUploading(false);
  //   }
  // };

  // const handleInvite = async (e) => {
  //   e.preventDefault();
  //   console.log(inviteData);
  //   try {
  //     const res = await api.post("/invites", inviteData);
  //     console.log(res.data);
  //   } catch (err) {
  //     console.log(err.response?.data?.message);
  //   } finally {
  //     setInviteData({
  //       email: "",
  //       role: "",
  //     });
  //   }
  // };

{
  /* INVITE */
}
{
  /* <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring" }}
            className="bg-white shadow-2xl px-6 sm:px-12 pt-10 sm:pt-15 
                   rounded-2xl w-full sm:w-[85%] lg:w-auto"
          >
            <motion.h1
              whileHover={{ color: "#1fc29f" }}
              className="text-2xl sm:text-3xl font-bold text-center text-gray-700"
            >
              Invite
            </motion.h1>

            <form
              onSubmit={handleInvite}
              className="px-3 sm:px-7 py-7 rounded-sm"
            >
              <motion.div
                whileTap={{
                  y: -10,
                }}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                }}
                className="my-3"
              >
                <label
                  htmlFor="email"
                  className="text-lg font-light tracking-wide"
                >
                  {" "}
                  Email{" "}
                </label>
                <input
                  id="email"
                  type="Email"
                  name="email"
                  value={inviteData.email}
                  onChange={handleChangeInvite}
                  required
                  placeholder="John@gmail.com"
                  className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-2 "
                />
              </motion.div>
              <motion.div
                whileTap={{
                  y: -10,
                }}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                }}
                className="my-3"
              >
                <label
                  htmlFor="role"
                  className="text-lg font-light tracking-wide"
                >
                  Please choose an Role
                </label>

                <select
                  name="role"
                  id="role"
                  value={inviteData.role}
                  onChange={handleChangeInvite}
                  required
                  className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-2 "
                >
                  <option value="" className="font-light ">
                    Choose a Role
                  </option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER" className="font-light">
                    MANAGER
                  </option>
                  <option value="MEMBER">MEMBER</option>
                </select>
              </motion.div>
              <motion.button
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring" }}
                type="submit"
                className="p-2 py-3 mt-5 text-white w-full border border-gray-400/50 rounded-lg tracking-wide text-xl bg-[#1fc29f] "
              >
                Invite
              </motion.button>
            </form>
          </motion.div> */
}

// <>
//   <div className="h-full w-full bg-[url(/bg.png)] ">
//     <div className="h-full w-full flex flex-row justify-center gap-40 items-center px-20 py-5">
//       <motion.div
//         initial={{
//           scale: 1,
//         }}
//         whileHover={{
//           scale: 1.02,
//         }}
//         transition={{
//           type: "spring",
//         }}
//         className="bg-white shadow-2xl px-12 pt-15 rounded-2xl"
//       >
//         <motion.h1
//           whileHover={{
//             color: "#1fc29f",
//           }}
//           className="text-3xl font-bold text-center text-gray-700"
//         >
//           Add Expense
//         </motion.h1>
//         <form onSubmit={handleExpense} className="px-7 py-10 rounded-sm ">
//           <motion.div
//             whileTap={{
//               y: -10,
//             }}
//             whileHover={{
//               x: 5,
//             }}
//             transition={{
//               type: "spring",
//             }}
//             className="my-3"
//           >
//             <label
//               htmlFor="amount"
//               className="text-lg font-light tracking-wide"
//             >
//               {" "}
//               Amount{" "}
//             </label>
//             <input
//               type="number"
//               id="amount"
//               name="amount"
//               value={expenseData.amount}
//               onChange={handleChangeExpense}
//               required
//               placeholder="200inr"
//               className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-2
//                  text-base  [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
//             />
//           </motion.div>
//           <motion.div
//             whileTap={{
//               y: -10,
//             }}
//             whileHover={{
//               x: 5,
//             }}
//             transition={{
//               type: "spring",
//             }}
//             className="my-3"
//           >
//             <label
//               htmlFor="category"
//               className="text-lg font-light tracking-wide"
//             >
//               {" "}
//               Category{" "}
//             </label>
//             <input
//               id="category"
//               type="text"
//               name="category"
//               value={expenseData.category}
//               onChange={handleChangeExpense}
//               required
//               placeholder="Food | Travel"
//               className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-2 "
//             />
//           </motion.div>
//           <motion.div
//             whileTap={{
//               y: -10,
//             }}
//             whileHover={{
//               x: 5,
//             }}
//             transition={{
//               type: "spring",
//             }}
//             className="my-3"
//           >
//             <label
//               htmlFor="description"
//               className="text-lg font-light tracking-wide"
//             >
//               {" "}
//               Description{" "}
//             </label>
//             <input
//               id="description"
//               type="text"
//               name="description"
//               value={expenseData.description}
//               onChange={handleChangeExpense}
//               required
//               placeholder="For help "
//               className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-2 "
//             />
//           </motion.div>
//           <motion.div
//             whileTap={{
//               y: -10,
//             }}
//             whileHover={{
//               x: 5,
//             }}
//             transition={{
//               type: "spring",
//             }}
//             className="my-3"
//           >
//             <label
//               htmlFor="reciept"
//               className="text-lg font-light tracking-wide"
//             >
//               {" "}
//               Reciept{" "}
//             </label>
//             <input
//               type="file"
//               id="reciept"
//               name="reciept"
//               value={expenseData.receipt}
//               onChange={handleChangeExpense}
//               className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-5 "
//             />
//           </motion.div>
//           <motion.button
//             initial={{ scale: 1 }}
//             whileHover={{ scale: 1.03 }}
//             transition={{ type: "spring" }}
//             type="submit"
//             className="p-2 py-3 mt-5 w-full border border-gray-400/50 text-white bg-[#1fc29f] rounded-lg tracking-wide  text-xl"
//           >
//             Add
//           </motion.button>
//         </form>
//       </motion.div>
//       <motion.div
//         initial={{
//           scale: 1,
//         }}
//         whileHover={{
//           scale: 1.02,
//         }}
//         transition={{
//           type: "spring",
//         }}
//         className="bg-white shadow-2xl px-12 pt-15 rounded-2xl"
//       >
//         <motion.h1
//           whileHover={{
//             color: "#1fc29f",
//           }}
//           className="text-3xl font-bold text-center text-gray-700 "
//         >
//           Invite
//         </motion.h1>
//         <form onSubmit={handleInvite} className="px-7 py-7 rounded-sm">
//           <motion.div
//             whileTap={{
//               y: -10,
//             }}
//             whileHover={{
//               x: 5,
//             }}
//             transition={{
//               type: "spring",
//             }}
//             className="my-3"
//           >
//             <label
//               htmlFor="email"
//               className="text-lg font-light tracking-wide"
//             >
//               {" "}
//               Email{" "}
//             </label>
//             <input
//               id="email"
//               type="Email"
//               name="email"
//               value={inviteData.email}
//               onChange={handleChangeInvite}
//               required
//               placeholder="John@gmail.com"
//               className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-2 "
//             />
//           </motion.div>
//           <motion.div
//             whileTap={{
//               y: -10,
//             }}
//             whileHover={{
//               x: 5,
//             }}
//             transition={{
//               type: "spring",
//             }}
//             className="my-3"
//           >
//             <label
//               htmlFor="role"
//               className="text-lg font-light tracking-wide"
//             >
//               Please choose an Role
//             </label>

//             <select
//               name="role"
//               id="role"
//               value={inviteData.role}
//               onChange={handleChangeInvite}
//               required
//               className="border border-gray-400/50 rounded-lg p-2 h-12 w-full my-1 mb-2 "
//             >
//               <option value="" className="font-light ">
//                 Choose a Role
//               </option>
//               <option value="ADMIN">ADMIN</option>
//               <option value="MANAGER" className="font-light">
//                 MANAGER
//               </option>
//               <option value="MEMBER">MEMBER</option>
//             </select>
//           </motion.div>
//           <motion.button
//             initial={{ scale: 1 }}
//             whileHover={{ scale: 1.03 }}
//             transition={{ type: "spring" }}
//             type="submit"
//             className="p-2 py-3 mt-5 text-white w-full border border-gray-400/50 rounded-lg tracking-wide text-xl bg-[#1fc29f] "
//           >
//             Invite
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   </div>
// </>
