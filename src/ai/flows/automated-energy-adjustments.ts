'use server';

/**
 * @fileOverview A flow that automatically turns off appliances in unoccupied rooms or when energy consumption exceeds a threshold.
 *
 * - automatedEnergyAdjustments - A function that handles the automated energy adjustment process.
 * - AutomatedEnergyAdjustmentsInput - The input type for the automatedEnergyAdjustments function.
 * - AutomatedEnergyAdjustmentsOutput - The return type for the automatedEnergyAdjustments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedEnergyAdjustmentsInputSchema = z.object({
  roomId: z.string().describe('The ID of the room to check.'),
  occupancy: z.number().describe('The number of occupants in the room.'),
  applianceStatuses: z.record(z.boolean()).describe('A map of appliance IDs to their on/off status.'),
  energyConsumptionThreshold: z.number().describe('The maximum allowed energy consumption for the room.'),
  currentEnergyConsumption: z.number().describe('The current energy consumption of the room.'),
});
export type AutomatedEnergyAdjustmentsInput = z.infer<typeof AutomatedEnergyAdjustmentsInputSchema>;

const AutomatedEnergyAdjustmentsOutputSchema = z.object({
  appliancesToTurnOff: z
    .array(z.string())
    .describe('A list of appliance IDs that should be turned off.'),
  reason: z.string().describe('The reason for turning off the appliances.'),
});
export type AutomatedEnergyAdjustmentsOutput = z.infer<
  typeof AutomatedEnergyAdjustmentsOutputSchema
>;

export async function automatedEnergyAdjustments(
  input: AutomatedEnergyAdjustmentsInput
): Promise<AutomatedEnergyAdjustmentsOutput> {
  return automatedEnergyAdjustmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedEnergyAdjustmentsPrompt',
  input: {schema: AutomatedEnergyAdjustmentsInputSchema},
  output: {schema: AutomatedEnergyAdjustmentsOutputSchema},
  prompt: `You are an AI assistant designed to optimize energy consumption in smart buildings.

You will receive information about a room, including its occupancy, the status of its appliances, and its current energy consumption.

Your goal is to identify appliances that should be turned off to reduce energy waste, either because the room is unoccupied or because the energy consumption exceeds a specified threshold.

Room ID: {{{roomId}}}
Occupancy: {{{occupancy}}}
Appliance Statuses: {{#each applianceStatuses}}{{{@key}}}: {{{this}}}, {{/each}}
Energy Consumption Threshold: {{{energyConsumptionThreshold}}}
Current Energy Consumption: {{{currentEnergyConsumption}}}

Instructions:

1.  If the room is unoccupied (occupancy is 0), identify all appliances that are currently ON and include them in the appliancesToTurnOff list.
2.  If the room is occupied but the currentEnergyConsumption exceeds the energyConsumptionThreshold, identify the appliances that are consuming the most energy and include them in the appliancesToTurnOff list until the energy consumption is below the threshold. Only turn off the minimum number of appliances required to go below the threshold.
3.  Provide a clear and concise reason for turning off the identified appliances in the reason field.

Output the appliances to turn off as a list of appliance IDs and the reason for turning them off.

Output format: {appliancesToTurnOff: ["appliance1", "appliance2"], reason: "Reason for turning off appliances"}
`,
});

const automatedEnergyAdjustmentsFlow = ai.defineFlow(
  {
    name: 'automatedEnergyAdjustmentsFlow',
    inputSchema: AutomatedEnergyAdjustmentsInputSchema,
    outputSchema: AutomatedEnergyAdjustmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
