"use server";

import {
  automatedEnergyAdjustments,
  type AutomatedEnergyAdjustmentsInput,
} from "@/ai/flows/automated-energy-adjustments";
import {
  occupancyDetection,
  type OccupancyDetectionInput,
} from "@/ai/flows/occupancy-detection";
import {
  predictEnergyUse,
  type PredictiveEnergyUseInput,
} from "@/ai/flows/predictive-energy-use-tool";

export async function detectOccupancy(
  input: OccupancyDetectionInput
) {
  const result = await occupancyDetection(input);
  return result;
}

export async function runAutomatedAdjustments(
  input: AutomatedEnergyAdjustmentsInput
) {
  const result = await automatedEnergyAdjustments(input);
  return result;
}

export async function predictEnergyUsage(
  input: PredictiveEnergyUseInput
) {
  const result = await predictEnergyUse(input);
  return result;
}
