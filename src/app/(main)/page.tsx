
"use client";

import { ApplianceControl } from "@/components/dashboard/appliance-control";
import { AutomatedAdjustments } from "@/components/dashboard/automated-adjustments";
import { OccupancyCard } from "@/components/dashboard/occupancy-card";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import type { Appliance } from "@/lib/types";
import { Fan, Lightbulb, Tv, Wind } from "lucide-react";
import { useState } from "react";

const initialAppliances: Appliance[] = [
  { id: "fan-1", name: "Ceiling Fan", icon: Fan, status: "On", power: 75 },
  { id: "light-1", name: "Main Lights", icon: Lightbulb, status: "On", power: 100 },
  { id: "tv-1", name: "Television", icon: Tv, status: "Off", power: 150 },
  { id: "ac-1", name: "Air Conditioner", icon: Wind, status: "Off", power: 1500 },
];

export default function DashboardPage() {
  const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances);
  const [occupancy, setOccupancy] = useState(0);
  const [energyThreshold, setEnergyThreshold] = useState(500); // Default threshold in Watts

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your smart energy management hub.</p>
      </div>

      <OverviewStats appliances={appliances} occupancy={occupancy} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ApplianceControl appliances={appliances} setAppliances={setAppliances} />
        </div>
        <div className="flex flex-col gap-6">
          <OccupancyCard setOccupancy={setOccupancy} setAppliances={setAppliances} />
          <AutomatedAdjustments 
            appliances={appliances}
            occupancy={occupancy}
            energyThreshold={energyThreshold}
            setAppliances={setAppliances}
          />
        </div>
      </div>
    </div>
  );
}
