import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import AuditFilterBar from "./AuditFilterBar.jsx";
import { motion } from "framer-motion";

// const actionColor = {
//   EXPENSE_CREATED: "bg-blue-500",
//   EXPENSE_APPROVED: "bg-green-500",
//   EXPENSE_REJECTED: "bg-red-500",
//   INVITE_SENT: "bg-purple-500",
//   USER_LOGIN: "bg-gray-500",
// };

const AuditFeed = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    action: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    const res = await api.get("/audit", {
      params: { ...filters, page, limit: 15 },
    });
    setLogs(res.data.data);
  };

  useEffect(() => {
    fetchLogs();
  }, [filters, page]);

  return (
    <>
      <AuditFilterBar
        filters={filters}
        onChange={(f) => {
          setFilters((prev) => ({ ...prev, ...f }));
          setPage(1);
        }}
        onReset={() => {
          setFilters({ action: "", startDate: "", endDate: "" });
          setPage(1);
        }}
      />

      <ul className="mt-6 space-y-4">
        {logs.map((log) => (
          <motion.li 
          initial={{
            x: 0
          }}
          whileHover={{
            x: 10
          }}
          transition={{
            type: "spring"
          }}
          key={log.id} className="border-l-4 pl-4">
            <p className="font-medium">
              {log.user.name} — {log.action.replaceAll("_", " ")}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </motion.li>
        ))}
      </ul>
    </>
  );
};

export default AuditFeed;

// const AuditFeed = () => {
//   const [logs, setLogs] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const fetchLogs = async (pageNum = 1) => {
//     if (loading) return;
//     setLoading(true);

//     try {
//       const res = await api.get("/audit", {
//         params: { page: pageNum, limit: 15 },
//       });

//       const { data, meta } = res.data;

//       setLogs((prev) => (pageNum === 1 ? data : [...prev, ...data]));

//       setHasMore(pageNum < meta.totalPages);
//     } catch (err) {
//       console.error("Failed to load audit logs", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLogs(1);
//   }, []);

//   useEffect(() => {
//     api.get("/audit").then((res) => {
//       console.log("Audit logs:", res.data);
//       setLogs(res.data.data);
//     });
//   }, []);

//   const loadMore = () => {
//     const next = page + 1;
//     setPage(next);
//     fetchLogs(next);
//   };

//   return (
//     <div className="bg-white border rounded-xl shadow-sm">
//       {/* Header */}
//       <div className="px-6 py-4 border-b">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Activity Timeline
//         </h2>
//         <p className="text-sm text-gray-500">
//           Track actions across your organization
//         </p>
//       </div>

//       {/* Timeline */}
//       <div className="px-6 py-6">
//         <div className="relative border-l border-gray-200">
//           {logs?.map((log) => (
//             <div key={log.id} className="mb-8 ml-6 flex items-start gap-4">
//               {/* Dot */}
//               <span
//                 className={`absolute -left-[7px] h-3 w-3 rounded-full ${
//                   actionColor[log.action] || "bg-gray-400"
//                 }`}
//               />

//               {/* Content */}
//               <div className="flex-1">
//                 <p className="text-sm text-gray-800">
//                   <span className="font-medium">
//                     {log.user?.name || "System"}
//                   </span>{" "}
//                   {log.message}
//                 </p>

//                 {log.metadata && (
//                   <div className="mt-1 text-xs text-gray-500">
//                     {console.log("logs : ", log)}
//                     {Object.entries(log.metadata).map(([key, value]) => (
//                       <span
//                         key={key}
//                         className="mr-2 inline-block rounded bg-gray-100 px-2 py-0.5"
//                       >
//                         {key}: {String(value)}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 <p className="mt-1 text-xs text-gray-400">
//                   {new Date(log.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           ))}

//           {!loading && logs.length === 0 && (
//             <p className="text-center text-sm text-gray-500">No activity yet</p>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="px-6 py-4 border-t text-center">
//         {loading && <span className="text-sm text-gray-500">Loading…</span>}

//         {!loading && hasMore && (
//           <button
//             onClick={loadMore}
//             className="text-sm font-medium text-emerald-600 hover:underline"
//           >
//             Load more
//           </button>
//         )}

//         {!hasMore && logs.length > 0 && (
//           <span className="text-sm text-gray-400">End of activity</span>
//         )}
//       </div>
//     </div>
//   );
// };
