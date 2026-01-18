import React, { useEffect, useState } from "react";
import api from "../../api/axios.js"

const roleBadge = {
  OWNER: "bg-purple-100 text-purple-700",
  ADMIN: "bg-blue-100 text-blue-700",
  MANAGER: "bg-yellow-100 text-yellow-700",
  MEMBER: "bg-gray-100 text-gray-600",
};

const PendingInvites = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const res = await api.get("/invites");
      setInvites(res.data);
    } finally {
      setLoading(false);
    }
  };

  const revokeInvite = async (id) => {
    await api.delete(`/invites/${id}`);
    setInvites((prev) => prev.filter((i) => i.id !== id));
  };

  const resendInvite = async (id) => {
    await api.post(`/invites/${id}/resend`);
    alert("Invite resent");
  };

  if (loading) return <p className="text-gray-500">Loading invites...</p>;

  if (!invites.length)
    return <p className="text-gray-400">No pending invites</p>;

  return (
    <>
      <div className="bg-white  rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Pending Invites
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Expires</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {invites.map((invite) => (
              <tr key={invite.id}>
                <td className="px-6 py-4">{invite.email}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      roleBadge[invite.role]
                    }`}
                  >
                    {invite.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(invite.expiresAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => resendInvite(invite.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Resend
                  </button>

                  <button
                    onClick={() => revokeInvite(invite.id)}
                    className="text-red-600 hover:underline"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PendingInvites;
