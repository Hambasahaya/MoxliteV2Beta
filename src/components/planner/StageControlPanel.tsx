"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLightToStage,
  updateLightProperties,
  deleteLight,
  selectLight,
  clearAllLights,
} from "@/store/stageSlice";
import { RootState } from "@/store/store";

const PRODUCTS = [
  "studio basic",
  "studio basic plus",
  "holystrom",
  "berlin",
  "parled",
  "optic",
  "amos",
  "ares",
];

const LIGHT_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
  { name: "Yellow", value: "#ffff00" },
  { name: "Cyan", value: "#00ffff" },
  { name: "Magenta", value: "#ff00ff" },
  { name: "Warm White", value: "#ffcc00" },
];

export default function StageControlPanel() {
  const dispatch = useDispatch();
  const stage = useSelector((state: RootState) => {
    const stageId = state.stage.currentStageId;
    return state.stage.stages.find((s) => s.id === stageId);
  });
  const selectedLightId = useSelector(
    (state: RootState) => state.stage.selectedLightId
  );

  const [newLightProduct, setNewLightProduct] = useState(PRODUCTS[0]);
  const [newLightColor, setNewLightColor] = useState("#ffffff");

  const selectedLight = stage?.lights.find((l) => l.id === selectedLightId);

  const handleAddLight = () => {
    dispatch(
      addLightToStage({
        productName: newLightProduct,
        position: { x: 0, y: 3, z: 0 },
        rotation: { x: -Math.PI / 4, y: 0, z: 0 },
        beamAngle: 30,
        intensity: 2,
        range: 20,
        color: newLightColor,
        type: "spot",
      })
    );
  };

  const handleUpdateLight = (
    updates: Record<string, any>
  ) => {
    if (!selectedLightId) return;

    dispatch(
      updateLightProperties({
        lightId: selectedLightId,
        updates,
      })
    );
  };

  const handleDeleteLight = () => {
    if (selectedLightId) {
      dispatch(deleteLight(selectedLightId));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage Control</h2>

      {/* Add Light Section */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Tambah Lampu
        </h3>

        <div className="space-y-4">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produk Lampu
            </label>
            <select
              value={newLightProduct}
              onChange={(e) => setNewLightProduct(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PRODUCTS.map((product) => (
                <option key={product} value={product}>
                  {product.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warna Lampu
            </label>
            <div className="grid grid-cols-4 gap-2">
              {LIGHT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setNewLightColor(color.value)}
                  className={`p-3 rounded-lg border-2 transition ${
                    newLightColor === color.value
                      ? "border-gray-800"
                      : "border-gray-300"
                  }`}
                  title={color.name}
                  style={{
                    backgroundColor: color.value,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddLight}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Tambah Lampu (+)
          </button>
        </div>
      </div>

      {/* Light Properties Section */}
      {selectedLight && (
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Properti Lampu
          </h3>

          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            {/* Product Name */}
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                Produk: <span className="font-bold">{selectedLight.productName}</span>
              </p>
            </div>

            {/* Beam Angle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beam Angle: {selectedLight.beamAngle}°
              </label>
              <input
                type="range"
                min="5"
                max="180"
                value={selectedLight.beamAngle}
                onChange={(e) =>
                  handleUpdateLight({ beamAngle: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Jangkauan cahaya lampu (5° - 180°)
              </p>
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity: {selectedLight.intensity.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={selectedLight.intensity}
                onChange={(e) =>
                  handleUpdateLight({ intensity: parseFloat(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Kecerahan lampu (0.1 - 5)
              </p>
            </div>

            {/* Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Range: {selectedLight.range}m
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={selectedLight.range}
                onChange={(e) =>
                  handleUpdateLight({ range: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Jarak jangkau cahaya (1m - 50m)
              </p>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posisi
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-600">X</label>
                  <input
                    type="number"
                    value={selectedLight.position.x.toFixed(1)}
                    onChange={(e) =>
                      handleUpdateLight({
                        position: {
                          ...selectedLight.position,
                          x: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Y</label>
                  <input
                    type="number"
                    value={selectedLight.position.y.toFixed(1)}
                    onChange={(e) =>
                      handleUpdateLight({
                        position: {
                          ...selectedLight.position,
                          y: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Z</label>
                  <input
                    type="number"
                    value={selectedLight.position.z.toFixed(1)}
                    onChange={(e) =>
                      handleUpdateLight({
                        position: {
                          ...selectedLight.position,
                          z: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotasi (Radian)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-600">RX</label>
                  <input
                    type="number"
                    value={selectedLight.rotation.x.toFixed(2)}
                    onChange={(e) =>
                      handleUpdateLight({
                        rotation: {
                          ...selectedLight.rotation,
                          x: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">RY</label>
                  <input
                    type="number"
                    value={selectedLight.rotation.y.toFixed(2)}
                    onChange={(e) =>
                      handleUpdateLight({
                        rotation: {
                          ...selectedLight.rotation,
                          y: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">RZ</label>
                  <input
                    type="number"
                    value={selectedLight.rotation.z.toFixed(2)}
                    onChange={(e) =>
                      handleUpdateLight({
                        rotation: {
                          ...selectedLight.rotation,
                          z: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDeleteLight}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Hapus Lampu (-)
            </button>
          </div>
        </div>
      )}

      {/* Lights List */}
      {stage && stage.lights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Daftar Lampu ({stage.lights.length})
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stage.lights.map((light) => (
              <button
                key={light.id}
                onClick={() => dispatch(selectLight(light.id))}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  selectedLightId === light.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: light.color }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {light.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Pos: ({light.position.x.toFixed(1)}, {light.position.y.toFixed(1)}, {light.position.z.toFixed(1)})
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => dispatch(clearAllLights())}
            className="w-full mt-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Hapus Semua Lampu
          </button>
        </div>
      )}

      {!stage?.lights || stage.lights.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada lampu di stage</p>
          <p className="text-xs text-gray-400 mt-2">Tambahkan lampu pertama Anda!</p>
        </div>
      )}
    </div>
  );
}
