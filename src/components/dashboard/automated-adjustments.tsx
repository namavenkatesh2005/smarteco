"use client";

import { runAutomatedAdjustments } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Appliance } from "@/lib/types";
import { Bot, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type AutomatedAdjustmentsProps = {
  appliances: Appliance[];
  occupancy: number;
  energyThreshold: number;
  setAppliances: React.Dispatch<React.SetStateAction<Appliance[]>>;
};

export function AutomatedAdjustments({
  appliances,
  occupancy,
  energyThreshold,
  setAppliances,
}: AutomatedAdjustmentsProps) {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: "", message: "" });
  const { toast } = useToast();

  const handleAutomation = async () => {
    setLoading(true);
    try {
      const applianceStatuses = appliances.reduce((acc, app) => {
        acc[app.id] = app.status === "On";
        return acc;
      }, {} as Record<string, boolean>);

      const currentEnergyConsumption = appliances
        .filter((a) => a.status === "On")
        .reduce((sum, a) => sum + a.power, 0);

      const result = await runAutomatedAdjustments({
        roomId: "living-room-1",
        occupancy,
        applianceStatuses,
        energyConsumptionThreshold: energyThreshold,
        currentEnergyConsumption,
      });

      if (result.appliancesToTurnOff.length > 0) {
        setDialogContent({ title: "AI Suggestion", message: result.reason });
        setDialogOpen(true);
        setAppliances((prev) =>
          prev.map((app) =>
            result.appliancesToTurnOff.includes(app.id)
              ? { ...app, status: "Off" }
              : app
          )
        );
      } else {
        toast({
          title: "System Optimized",
          description: "No adjustments needed at this time.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Automation Failed",
        description: "The AI adjustment tool failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Automated Adjustments</CardTitle>
          <CardDescription>
            Let our AI optimize your energy usage automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            The AI will check if the room is empty or if energy use exceeds
            your {energyThreshold}W threshold. It will then suggest turning off
            non-essential appliances.
          </p>
          <Button
            onClick={handleAutomation}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Bot className="mr-2" />
            )}
            <span>{loading ? "Optimizing..." : "Optimize with AI"}</span>
          </Button>
        </CardContent>
      </Card>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
