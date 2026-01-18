import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin", desc: "Manage expenses & members" },
  { value: "MANAGER", label: "Manager", desc: "Approve expenses" },
  { value: "MEMBER", label: "Member", desc: "Submit expenses" },
];

const InviteMemberPanel = ({ open, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleInvite = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/invites", { email, role });
      console.log(res.data);

      setEmail("");
      setRole("MEMBER");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invite failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          className="w-full max-w-md bg-white h-full shadow-xl"
        >
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Invite Member</h2>
            <p className="text-sm text-gray-500">
              Add people to your organization
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="user@company.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              <p className="text-xs text-gray-500 mt-1">
                {ROLE_OPTIONS.find((r) => r.value === role)?.desc}
              </p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* Footer */}
          <div className="p-6 border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              onClick={handleInvite}
              disabled={loading || !email}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
            >
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default InviteMemberPanel;
