"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
_ChartTooltipContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { day: "Monday", usage: 1860 },
  { day: "Tuesday", usage: 3050 },
  { day: "Wednesday", usage: 2370 },
  { day: "Thursday", usage: 2010 },
  { day: "Friday", usage: 2590 },
  { day: "Saturday", usage: 3200 },
  { day: "Sunday", usage: 2980 },
];

const chartConfig = {
  usage: {
    label: "Energy (Wh)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function EnergyUsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Usage Report</CardTitle>
        <CardDescription>Daily energy consumption for the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickFormatter={(value) => `${value / 1000} kWh`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="usage" fill="var(--color-usage)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
