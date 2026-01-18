import { useState } from "react";
import api from "../api/axios";

export default function ExpenseForm({ onCreated }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/expenses", {
      ...form,
      amount: Number(form.amount),
    });
    onCreated(res.data);
    setForm({ amount: "", category: "", description: "" });
  };

  return (
    <form onSubmit={submit} className="border p-4 mb-6 rounded">
      <h2 className="text-lg mb-2">Create Expense</h2>

      <input
        className="input mb-2"
        placeholder="Amount"
        type="number"
        required
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
      />

      <input
        className="input mb-2"
        placeholder="Category"
        required
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      />

      <input
        className="input mb-4"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <button className="btn w-full">Submit</button>
    </form>
  );
}
