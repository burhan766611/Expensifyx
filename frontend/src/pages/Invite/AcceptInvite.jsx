import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { AuthContext } from "../../context/AuthContext.js";

const AcceptInvite = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const token = params.get("token");

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState("");

  // 🔹 Validate invite token
  useEffect(() => {
    const validateInvite = async () => {
      try {
        const res = await api.get(`/invites/validate?token=${token}`);
        setInvite(res.data);
      } catch (err) {
        setError("Invalid or expired invite");
      } finally {
        setLoading(false);
      }
    };

    if (token) validateInvite();
    else {
      setError("Missing invite token");
      setLoading(false);
    }
  }, [token]);

  // 🔹 Accept invite
  const handleAccept = async () => {
    try {
      console.log("token : ", token)
      await api.post("/invites/accept", { token });
      const me = await api.get("/auth/me")

      setUser(me.data.user); // 🔥 auto-login / rehydrate
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept invite");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Validating invite…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow max-w-md text-center">
          <h2 className="text-lg font-semibold text-red-600">Invite Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h1 className="text-xl font-semibold text-gray-800">
          You’re invited 🎉
        </h1>

        <p className="mt-2 text-gray-600">
          You’ve been invited to join <strong>{invite.orgName}</strong> as{" "}
          <strong>{invite.role}</strong>
        </p>

        <div className="mt-6">
          {user ? (
            <button
              onClick={handleAccept}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
            >
              Join Organization
            </button>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-3">
                Please login or sign up to continue
              </p>

              <button
                onClick={() => navigate(`/login?invite=${token}`)}
                className="w-full mb-3 border rounded-lg py-2 hover:bg-gray-50"
              >
                Login
              </button>

              <button
                onClick={() => navigate(`/register?invite=${token}`)}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
              >
                Sign Up
              </button>
            </>
           )} 
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
