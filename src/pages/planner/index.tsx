import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planner - Moxlite",
  description: "Tools untuk desain stage dan pencahayaan",
};

export default function PlannerIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-6">🎬</div>
        <h1 className="text-4xl font-bold mb-4">Moxlite Planner</h1>
        <p className="text-xl text-gray-400 mb-8">
          Pilih alat desain yang Anda inginkan
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl mx-auto">
          <a
            href="/planner/stage-3d"
            className="group bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-8 rounded-lg transition transform hover:scale-105 shadow-xl"
          >
            <div className="text-5xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold mb-2">Stage 3D Planner</h2>
            <p className="text-purple-100">
              Desain stage dan atur pencahayaanmu dengan mudah
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
