import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StageState, Stage, Light } from "./types";

const initialState: StageState = {
  stages: [
    {
      id: "stage-1",
      name: "Stage 1",
      width: 10,
      height: 8,
      depth: 5,
      lights: [],
      backgroundColor: "#1a1a2e",
      groundColor: "#16213e",
    },
  ],
  currentStageId: "stage-1",
  selectedLightId: null,
  isLoading: false,
  error: null,
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    // Create new stage
    createStage: (state, action: PayloadAction<Omit<Stage, "id" | "lights">>) => {
      const newStage: Stage = {
        ...action.payload,
        id: `stage-${Date.now()}`,
        lights: [],
      };
      state.stages.push(newStage);
      state.currentStageId = newStage.id;
    },

    // Set current stage
    setCurrentStage: (state, action: PayloadAction<string>) => {
      state.currentStageId = action.payload;
      state.selectedLightId = null;
    },

    // Add light to stage
    addLightToStage: (
      state,
      action: PayloadAction<Omit<Light, "id">>
    ) => {
      if (!state.currentStageId) return;

      const stage = state.stages.find((s) => s.id === state.currentStageId);
      if (!stage) return;

      const newLight: Light = {
        ...action.payload,
        id: `light-${Date.now()}`,
      };

      stage.lights.push(newLight);
      state.selectedLightId = newLight.id;
    },

    // Update light position
    updateLightPosition: (
      state,
      action: PayloadAction<{
        lightId: string;
        position: { x: number; y: number; z: number };
      }>
    ) => {
      const stage = state.stages.find((s) => s.id === state.currentStageId);
      if (!stage) return;

      const light = stage.lights.find((l) => l.id === action.payload.lightId);
      if (light) {
        light.position = action.payload.position;
      }
    },

    // Update light rotation
    updateLightRotation: (
      state,
      action: PayloadAction<{
        lightId: string;
        rotation: { x: number; y: number; z: number };
      }>
    ) => {
      const stage = state.stages.find((s) => s.id === state.currentStageId);
      if (!stage) return;

      const light = stage.lights.find((l) => l.id === action.payload.lightId);
      if (light) {
        light.rotation = action.payload.rotation;
      }
    },

    // Update light properties
    updateLightProperties: (
      state,
      action: PayloadAction<{
        lightId: string;
        updates: Partial<Light>;
      }>
    ) => {
      const stage = state.stages.find((s) => s.id === state.currentStageId);
      if (!stage) return;

      const light = stage.lights.find((l) => l.id === action.payload.lightId);
      if (light) {
        Object.assign(light, action.payload.updates);
      }
    },

    // Select light
    selectLight: (state, action: PayloadAction<string | null>) => {
      state.selectedLightId = action.payload;
    },

    // Delete light
    deleteLight: (state, action: PayloadAction<string>) => {
      const stage = state.stages.find((s) => s.id === state.currentStageId);
      if (!stage) return;

      stage.lights = stage.lights.filter((l) => l.id !== action.payload);
      if (state.selectedLightId === action.payload) {
        state.selectedLightId = null;
      }
    },

    // Update stage properties
    updateStageProperties: (
      state,
      action: PayloadAction<{
        stageId: string;
        updates: Partial<Stage>;
      }>
    ) => {
      const stage = state.stages.find((s) => s.id === action.payload.stageId);
      if (stage) {
        Object.assign(stage, action.payload.updates);
      }
    },

    // Clear all lights
    clearAllLights: (state) => {
      const stage = state.stages.find((s) => s.id === state.currentStageId);
      if (stage) {
        stage.lights = [];
        state.selectedLightId = null;
      }
    },

    // Load template for current stage
    loadTemplate: (
      state,
      action: PayloadAction<{ templateId: string; templatePath: string; width: number; height: number; depth: number }>
    ) => {
      const currentStage = state.stages.find((s) => s.id === state.currentStageId);
      if (currentStage) {
        currentStage.templateId = action.payload.templateId;
        currentStage.templatePath = action.payload.templatePath;
        currentStage.width = action.payload.width;
        currentStage.height = action.payload.height;
        currentStage.depth = action.payload.depth;
        currentStage.lights = []; // Clear lights when loading new template
      }
    },

    // Clear template from current stage
    clearTemplate: (state) => {
      const currentStage = state.stages.find((s) => s.id === state.currentStageId);
      if (currentStage) {
        currentStage.templateId = undefined;
        currentStage.templatePath = undefined;
      }
    },
  },
});

export const {
  createStage,
  setCurrentStage,
  addLightToStage,
  updateLightPosition,
  updateLightRotation,
  updateLightProperties,
  selectLight,
  deleteLight,
  updateStageProperties,
  clearAllLights,
  loadTemplate,
  clearTemplate,
} = stageSlice.actions;

export default stageSlice.reducer;
