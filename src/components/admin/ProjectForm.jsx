"use client";

import { useState } from "react";
import { techStacks } from "@/data/techStacks";
import { projectRoles } from "@/data/projectRoles";

export default function ProjectForm({ mode = "create", initialData = null }) {

    const emptyProject = {
        title: "",
        slug: "",
        desc: "",
        image: "",
        category: "",
        type: "",
        status: "Draft",
        location: "",
        start: "",
        end: "",
        featured: false,
        techStack: [],
        role: [],
        detail: {
            gallery: [],
            problem: "",
            solution: "",
            features: [],
            demoUrl: "",
            githubUrl: "",
        },
    };

    // form = dữ liệu edit hoặc form rỗng khi tạo mới
    const [form, setForm] = useState(() => initialData || emptyProject);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleDetailChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            detail: { ...prev.detail, [field]: value },
        }));
    };

    const toggleArrayField = (field, value) => {
        setForm((prev) => {
            const current = Array.isArray(prev[field]) ? prev[field] : [];
            return current.includes(value)
                ? { ...prev, [field]: current.filter((v) => v !== value) }
                : { ...prev, [field]: [...current, value] };
        });
    };

    const handleGalleryChange = (i, value) => {
        setForm((prev) => {
            const gallery = [...prev.detail.gallery];
            gallery[i] = value;
            return { ...prev, detail: { ...prev.detail, gallery } };
        });
    };

    const addGalleryItem = () => {
        setForm((prev) => ({
            ...prev,
            detail: {
                ...prev.detail,
                gallery: [...prev.detail.gallery, ""],
            },
        }));
    };

    const handleFeatureChange = (i, value) => {
        setForm((prev) => {
            const features = [...prev.detail.features];
            features[i] = value;
            return { ...prev, detail: { ...prev.detail, features } };
        });
    };

    const addFeature = () => {
        setForm((prev) => ({
            ...prev,
            detail: { ...prev.detail, features: [...prev.detail.features, ""] },
        }));
    };

    const handleSubmit = () => {
        if (mode === "create") {
            console.log("CREATE PROJECT:", form);
            alert("Fake CREATE — xem console");
        } else {
            console.log("UPDATE PROJECT:", form);
            alert("Fake UPDATE — xem console");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-6">

            {/* LEFT COLUMN */}
            <div className="space-y-6">

                {/* BASIC INFO */}
                <div className="bg-white rounded-2xl shadow p-5 space-y-4">
                    <h2 className="text-sm font-semibold mb-1">Basic Information</h2>

                    <Field label="Project Title">
                        <input
                            value={form.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="input-base w-full"
                        />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Slug" hint="/projects/[slug]">
                            <input
                                value={form.slug}
                                onChange={(e) => handleChange("slug", e.target.value)}
                                className="input-base"
                            />
                        </Field>

                        <Field label="Thumbnail URL">
                            <input
                                value={form.image}
                                onChange={(e) => handleChange("image", e.target.value)}
                                className="input-base"
                            />
                        </Field>
                    </div>

                    <Field label="Short Description">
                        <textarea
                            value={form.desc}
                            onChange={(e) => handleChange("desc", e.target.value)}
                            className="input-base h-24"
                        />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Category">
                            <input
                                value={form.category}
                                onChange={(e) => handleChange("category", e.target.value)}
                                className="input-base"
                            />
                        </Field>

                        <Field label="Type">
                            <input
                                value={form.type}
                                onChange={(e) => handleChange("type", e.target.value)}
                                className="input-base"
                            />
                        </Field>

                        <Field label="Status">
                            <select
                                value={form.status}
                                onChange={(e) => handleChange("status", e.target.value)}
                                className="input-base"
                            >
                                <option>Draft</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                                <option>Archived</option>
                            </select>
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Location">
                            <input
                                value={form.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                                className="input-base"
                            />
                        </Field>

                        <Field label="Start">
                            <input
                                value={form.start}
                                onChange={(e) => handleChange("start", e.target.value)}
                                className="input-base"
                            />
                        </Field>

                        <Field label="End">
                            <input
                                value={form.end}
                                onChange={(e) => handleChange("end", e.target.value)}
                                className="input-base"
                            />
                        </Field>
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(e) => handleChange("featured", e.target.checked)}
                        />
                        <span>Featured project</span>
                    </label>
                </div>

                {/* CASE STUDY CONTENT */}
                <div className="bg-white rounded-2xl shadow p-5 space-y-4">
                    <h2 className="text-sm font-semibold">Case Study Content</h2>

                    <Field label="Problem">
                        <textarea
                            value={form.detail.problem}
                            onChange={(e) => handleDetailChange("problem", e.target.value)}
                            className="input-base h-28"
                        />
                    </Field>

                    <Field label="Solution">
                        <textarea
                            value={form.detail.solution}
                            onChange={(e) => handleDetailChange("solution", e.target.value)}
                            className="input-base h-28"
                        />
                    </Field>
                </div>

                {/* FEATURES */}
                <div className="bg-white rounded-2xl shadow p-5 space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold">Key Features</h2>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="text-xs px-2 py-1 border rounded-lg"
                        >
                            + Add feature
                        </button>
                    </div>

                    {form.detail.features.map((f, i) => (
                        <input
                            key={i}
                            value={f}
                            onChange={(e) => handleFeatureChange(i, e.target.value)}
                            className="input-base"
                        />
                    ))}
                </div>

                {/* LINKS */}
                <div className="bg-white rounded-2xl shadow p-5 space-y-3">
                    <h2 className="text-sm font-semibold">Links</h2>

                    <Field label="Demo URL">
                        <input
                            value={form.detail.demoUrl}
                            onChange={(e) =>
                                handleDetailChange("demoUrl", e.target.value)
                            }
                            className="input-base"
                        />
                    </Field>

                    <Field label="GitHub URL">
                        <input
                            value={form.detail.githubUrl}
                            onChange={(e) =>
                                handleDetailChange("githubUrl", e.target.value)
                            }
                            className="input-base"
                        />
                    </Field>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2.5 bg-black text-white rounded-xl text-sm"
                    >
                        {mode === "create" ? "Create Project" : "Save Changes"}
                    </button>
                </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">

                {/* TECH STACK */}
                <div className="bg-white rounded-2xl shadow p-5">
                    <h2 className="text-sm font-semibold mb-3">Tech Stack</h2>
                    <div className="flex flex-wrap gap-2">
                        {techStacks.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => toggleArrayField("techStack", t.id)}
                                className={`px-3 py-1.5 rounded-full text-xs border ${
                                    form.techStack.includes(t.id)
                                        ? "bg-yellow-100 border-yellow-400"
                                        : "bg-gray-50"
                                }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ROLES */}
                <div className="bg-white rounded-2xl shadow p-5">
                    <h2 className="text-sm font-semibold mb-3">Roles</h2>
                    <div className="flex flex-wrap gap-2">
                        {projectRoles.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => toggleArrayField("role", r.id)}
                                className={`px-3 py-1.5 rounded-full text-xs border ${
                                    form.role.includes(r.id)
                                        ? "bg-blue-100 border-blue-400"
                                        : "bg-gray-50"
                                }`}
                            >
                                {r.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GALLERY */}
                <div className="bg-white rounded-2xl shadow p-5 space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold">Gallery Images</h2>
                        <button
                            type="button"
                            onClick={addGalleryItem}
                            className="text-xs px-2 py-1 border rounded-lg"
                        >
                            + Add image
                        </button>
                    </div>

                    {form.detail.gallery.map((url, i) => (
                        <div key={i} className="flex gap-3">
                            <input
                                value={url}
                                onChange={(e) => handleGalleryChange(i, e.target.value)}
                                className="input-base flex-1"
                            />
                            {url && (
                                <img
                                    src={url}
                                    className="w-14 h-14 rounded-lg object-cover border"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Field({ label, hint, children }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 flex justify-between">
                <span>{label}</span>
                {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
            </label>
            {children}
        </div>
    );
}
