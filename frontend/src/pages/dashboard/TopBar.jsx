import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; 

const roleColors = {
  OWNER: "bg-purple-100 text-purple-700",
  ADMIN: "bg-blue-100 text-blue-700",
  MEMBER: "bg-gray-100 text-gray-600",
  MANAGER: "bg-green-100 text-yellow-600/80",
};

const TopBar = ({ onInvite }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-[#1fc29f] border-b">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${roleColors[user.role]}`}
          >
            {user.role}
          </span>
          <h1 className="text-base sm:text-lg font-semibold text-gray-800">
            ExpensifyX
          </h1>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/dash")}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/expense")}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600"
          >
            Add Expense
          </button>

          {(user.role === "OWNER" || user.role === "ADMIN") && (
            <button
              onClick={onInvite}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              Invite
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
          <button
            onClick={() => {
              navigate("/dash");
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/expense");
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Add Expense
          </button>

          {(user.role === "OWNER" || user.role === "ADMIN") && (
            <button
              onClick={() => {
                onInvite?.();
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              Invite
            </button>
          )}

          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default TopBar;



// import React, { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import { Navigate, useNavigate } from "react-router-dom";

// const roleColors = {
//   OWNER: "bg-purple-100 text-purple-700",
//   ADMIN: "bg-blue-100 text-blue-700",
//   MEMBER: "bg-gray-100 text-gray-600",
//   MANAGER: "bg-green-100 text-yellow-600/80",
// };

// const TopBar = ({ onInvite }) => {
//   const navigate = useNavigate();
//   const { user, logout } = useContext(AuthContext);

//   if (!user) return null;

//   return (
//     <>
//       <div className="sticky top-0 z-40 bg-white border-b px-6 py-3 flex items-center justify-between">
//         {/* LEFT — Role */}
//         <div className="flex items-center gap-3">
//           <span
//             className={`px-3 py-1 rounded-full text-sm font-semibold ${
//               roleColors[user.role]
//             }`}
//           >
//             {user.role}
//           </span>
//           <h1 className="text-lg font-semibold text-gray-800">ExpensifyX</h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/dash")}
//             className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
//           >
//             Dashboard
//           </button>

//           <button
//             onClick={ () => navigate("/expense") }
//             className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600"
//           >
//             Add Expense
//           </button>

//           {(user.role === "OWNER" || user.role === "ADMIN") && (
//             <button
//               onClick={onInvite}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
//             >
//               Invite
//             </button>
//           )}

//           <button
//             onClick={logout}
//             className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TopBar;

// {/* RIGHT — Actions */}
// <div className="flex items-center gap-4">
//   {(user.role === "OWNER" || user.role === "ADMIN") && (
//     <>
//     <button
//       onClick={onInvite}
//       className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
//     >
//       Invite
//     </button>
//     </>
//   )}
//   <button
//       onClick={logout}
//       className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
//     >
//       Logout
//     </button>

// </div>
