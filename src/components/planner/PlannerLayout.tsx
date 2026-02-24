"use client";

import React, { useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import Stage3DScene from "./Stage3DScene";
import StageControlPanel from "./StageControlPanel";
import PlannerHeader from "./PlannerHeader";
import TemplatePickerModal from "./TemplatePickerModal";
import { loadTemplate } from "@/store/stageSlice";
import type { AppDispatch } from "@/store/store";

function PlannerContent() {
  const [selectedLightId, setSelectedLightId] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSelectTemplate = (templateId: string, templatePath: string, width: number, height: number, depth: number) => {
    dispatch(loadTemplate({ templateId, templatePath, width, height, depth }));
    setShowTemplateModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <PlannerHeader onLoadTemplateClick={() => setShowTemplateModal(true)} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Scene */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700">
              <Stage3DScene
                onLightSelected={setSelectedLightId}
              />
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-1">
            <StageControlPanel />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">📐 Drag & Drop</h3>
            <p className="text-sm text-blue-100">
              Drag lampu di scene untuk memindahkan posisi dengan bebas.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">⚙️ Kontrol</h3>
            <p className="text-sm text-green-100">
              Gunakan panel kanan untuk adjust beam angle, intensity, dan posisi dengan presisi.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">💾 Live Preview</h3>
            <p className="text-sm text-purple-100">
              Lihat preview real-time jangkauan cahaya dan efek pencahayaan stage.
            </p>
          </div>
        </div>
      </div>

      {/* Template Picker Modal */}
      <TemplatePickerModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

export default function PlannerLayout() {
  return (
    <Provider store={store}>
      <PlannerContent />
    </Provider>
  );
}
