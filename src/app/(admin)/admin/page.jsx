"use client";

import StatCard from "@/components/feature/dashboard/StatCard";
import AnalyticsCard from "@/components/feature/dashboard/AnalyticsCard";
import TeamList from "@/components/feature/dashboard/TeamList";
import ProjectList from "@/components/feature/dashboard/ProjectList";
import ReminderCard from "@/components/feature/dashboard/ReminderCard";
import TimeTracker from "@/components/feature/dashboard/TimeTracker";

export default function AdminHomePage() {
    return (
        <div className="mx-auto w-full">

            {/* TITLE + ACTIONS */}
            <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Plan, prioritize, and accomplish your tasks with ease.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm">
                        Import Data
                    </button>
                    <button className="px-6 py-2 rounded-full bg-green-600 text-white text-sm font-medium">
                        + Add Project
                    </button>
                </div>
            </section>

            {/* SECTION 1 — STATS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Projects" value="24" note="Increased from last month" accent="green" />
                <StatCard title="Ended Projects" value="10" note="Increased from last month" accent="green" />
                <StatCard title="Running Projects" value="12" note="Increased from last month" accent="green" />
                <StatCard title="Pending Projects" value="2" note="On Discuss" accent="orange" />
            </section>

            {/* SECTION 2 — ANALYTICS + REMINDERS */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
                <div className="xl:col-span-2">
                    <AnalyticsCard />
                </div>
                <ReminderCard />
            </section>

            {/* SECTION 3 — TEAM + PROJECTS + TIME TRACK */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TeamList />
                    <ProjectList />
                </div>

                <TimeTracker />
            </section>

        </div>
    );
}
