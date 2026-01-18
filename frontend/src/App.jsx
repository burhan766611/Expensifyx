import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Expense";
import AcceptInvite from "../src/pages/Invite/AcceptInvite"
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import TopBar from "./pages/dashboard/TopBar";
import Dash from "./pages/Dash";
import Signup from "./pages/Signup";
import Expense from "./pages/Expense";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invite/accept" element={<AcceptInvite />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/topbar" element={<TopBar />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
      </Routes>
    </>
  );
}
