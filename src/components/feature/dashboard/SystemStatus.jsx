"use client";
import { FaServer, FaDatabase, FaCodeBranch } from "react-icons/fa6";

export default function SystemStatus() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaServer className="text-gray-400" /> Trạng thái hệ thống
            </h3>

            <div className="space-y-6">
                {/* Server Item */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                            <FaServer className="text-sm" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700">API Server</p>
                            <p className="text-xs text-gray-400">Node.js / Express</p>
                        </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Online
                    </span>
                </div>

                {/* Database Item */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FaDatabase className="text-sm" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Database</p>
                            <p className="text-xs text-gray-400">MongoDB Atlas</p>
                        </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Connected
                    </span>
                </div>

                {/* Version Item */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center">
                            <FaCodeBranch className="text-sm" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Version</p>
                            <p className="text-xs text-gray-400">Current Build</p>
                        </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        v1.0.0
                    </span>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50">
                <p className="text-xs text-center text-gray-400">
                    Last checked: {new Date().toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}