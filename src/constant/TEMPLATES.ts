// Template data structure untuk stage 3D planner
export interface StageTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  modelPath: string;
  width: number;
  height: number;
  depth: number;
}

export const STAGE_TEMPLATES: StageTemplate[] = [
  {
    id: "great-events-venue",
    name: "Great Events Venue",
    description: "Professional venue stage template untuk event besar dengan layout optimal",
    category: "Venue",
    thumbnail: "/model/templates/imgTemplate.jpeg",
    modelPath: "/model/templates/venue_stage_for_great_events.glb",
    width: 15,
    height: 8,
    depth: 12,
  },
];

export const STAGE_CATEGORIES = [
  "All",
  "Venue",
  "Festival",
  "Concert",
  "Corporate",
  "Wedding",
];
