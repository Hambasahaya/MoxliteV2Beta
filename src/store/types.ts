// Stage 3D types
export interface Light {
  id: string;
  productName: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  beamAngle: number;
  intensity: number;
  range: number;
  color: string;
  type: "spot" | "point" | "directional";
}

export interface Stage {
  id: string;
  name: string;
  width: number;
  height: number;
  depth: number;
  lights: Light[];
  backgroundColor: string;
  groundColor: string;
  templateId?: string; // Template yang digunakan
  templatePath?: string; // Path ke GLB file
}

export interface StageState {
  stages: Stage[];
  currentStageId: string | null;
  selectedLightId: string | null;
  isLoading: boolean;
  error: string | null;
}
