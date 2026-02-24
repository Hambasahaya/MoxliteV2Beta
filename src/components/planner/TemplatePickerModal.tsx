"use client";

import React, { useState } from "react";
import { STAGE_TEMPLATES, STAGE_CATEGORIES, StageTemplate } from "@/constant/TEMPLATES";

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string, templatePath: string, width: number, height: number, depth: number) => void;
}

export default function TemplatePickerModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplatePickerModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<StageTemplate | null>(null);

  const filteredTemplates =
    selectedCategory === "All"
      ? STAGE_TEMPLATES
      : STAGE_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(
        selectedTemplate.id,
        selectedTemplate.modelPath,
        selectedTemplate.width,
        selectedTemplate.height,
        selectedTemplate.depth
      );
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Select Stage Template</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded"
          >
            ×
          </button>
        </div>

        {/* Category Filter */}
        <div className="px-6 py-4 border-b border-gray-700">
          <p className="text-gray-300 text-sm mb-3">Filter by Category:</p>
          <div className="flex flex-wrap gap-2">
            {STAGE_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No templates found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`cursor-pointer rounded-lg overflow-hidden transition-all transform hover:scale-105 ${
                    selectedTemplate?.id === template.id
                      ? "ring-2 ring-cyan-500 scale-105"
                      : "ring-1 ring-gray-600 hover:ring-gray-500"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="bg-gray-800 h-40 flex items-center justify-center">
                    {template.thumbnail ? (
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-500 text-center">
                        <div className="text-3xl mb-2">📦</div>
                        <p className="text-xs">No preview</p>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="bg-gray-800 p-3">
                    <h3 className="font-semibold text-white text-sm truncate">
                      {template.name}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 mt-1">
                      {template.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-cyan-400 text-xs font-medium">{template.category}</span>
                      <span className="text-gray-500 text-xs">
                        {template.width}×{template.depth}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUseTemplate}
            disabled={!selectedTemplate}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedTemplate
                ? "bg-cyan-600 text-white hover:bg-cyan-700"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Use Selected
          </button>
        </div>
      </div>
    </div>
  );
}
