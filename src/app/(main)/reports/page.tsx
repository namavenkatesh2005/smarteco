import { EnergyUsageChart } from "@/components/reports/energy-usage-chart";
import { PredictiveEnergyForm } from "@/components/reports/predictive-energy-form";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Predictions</h1>
        <p className="text-muted-foreground">
          Analyze past usage and predict future energy needs.
        </p>
      </div>

      <EnergyUsageChart />
      <PredictiveEnergyForm />
    </div>
  );
}
