"use client";

import Link from "next/link";

export default function PlannerAccessButton() {
  return (
    <Link
      href="/planner/stage-3d"
      className="fixed bottom-24 right-6 z-30 group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
        
        <button className="relative bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition flex items-center justify-center text-2xl font-bold group-hover:scale-110">
          🎬
        </button>

        <div className="absolute bottom-full right-0 mb-4 bg-gray-900 text-white px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
          Stage 3D Planner
        </div>
      </div>
    </Link>
  );
}
