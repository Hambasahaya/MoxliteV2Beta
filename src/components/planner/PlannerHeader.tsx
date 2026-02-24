"use client";

import React from "react";
import Link from "next/link";

interface PlannerHeaderProps {
  onLoadTemplateClick?: () => void;
}

export default function PlannerHeader({ onLoadTemplateClick }: PlannerHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎬</div>
            <div>
              <h1 className="text-2xl font-bold">Moxlite Stage 3D Planner</h1>
              <p className="text-blue-100 text-sm">
                Desain stage & atur pencahayaan dengan mudah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLoadTemplateClick}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
            >
              📐 Template
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium">
              💾 Simpan
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium">
              📥 Import
            </button>
            <Link
              href="/"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
            >
              ← Kembali
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
