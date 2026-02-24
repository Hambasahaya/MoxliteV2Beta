import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stage 3D Planner - Moxlite",
  description: "Design stage dan atur lampu sesuai kebutuhan Anda",
};

import PlannerLayout from "@/components/planner/PlannerLayout";

export default function Stage3DPlannerPage() {
  return <PlannerLayout />;
}
