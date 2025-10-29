"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appliance } from "@/lib/types";
import { Power, Users, Zap } from "lucide-react";

type OverviewStatsProps = {
  appliances: Appliance[];
  occupancy: number;
};

export function OverviewStats({ appliances, occupancy }: OverviewStatsProps) {
  const totalConsumption = appliances
    .filter((a) => a.status === "On")
    .reduce((sum, a) => sum + a.power, 0);

  const activeAppliances = appliances.filter((a) => a.status === "On").length;

  const stats = [
    {
      title: "Total Consumption",
      value: `${totalConsumption} W`,
      icon: Zap,
    },
    {
      title: "Active Appliances",
      value: `${activeAppliances} / ${appliances.length}`,
      icon: Power,
    },
    {
      title: "Detected Occupants",
      value: occupancy,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
