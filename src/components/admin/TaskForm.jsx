"use client";

import { useState } from "react";

export default function TaskForm({ mode, initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    priority: initialData.priority || "Medium",
    status: initialData.status || "Todo",
    deadline: initialData.deadline || "",
    description: initialData.description || "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 bg-white rounded-xl shadow p-6">

      <div>
        <label className="text-sm font-semibold">Title</label>
        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="input-base w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="input-base w-full"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">Status</label>
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="input-base w-full"
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">Deadline</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
            className="input-base w-full"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Description</label>
        <textarea
          className="input-base w-full h-24 resize-none"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <button
        onClick={() => onSubmit?.(form)}
        className="px-5 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
      >
        {mode === "edit" ? "Save Changes" : "Create Task"}
      </button>
    </div>
  );
}
