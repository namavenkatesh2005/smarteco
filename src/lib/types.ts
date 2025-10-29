import type { LucideIcon } from "lucide-react";

export type Appliance = {
  id: string;
  name: string;
  icon: LucideIcon;
  status: "On" | "Off";
  power: number; // in Watts
};
