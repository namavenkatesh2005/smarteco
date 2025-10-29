// src/ai/flows/predictive-energy-use-tool.ts
'use server';
/**
 * @fileOverview Predicts future energy consumption and suggests adjustments.
 *
 * - predictEnergyUse - A function that predicts future energy consumption.
 * - PredictiveEnergyUseInput - The input type for the predictEnergyUse function.
 * - PredictiveEnergyUseOutput - The return type for the predictEnergyUse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveEnergyUseInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical energy consumption data, as a string.  Each line should be a date followed by the energy consumption for that date.'
    ),
  currentDate: z.string().describe('The current date.'),
  preferences: z.string().optional().describe('The user preferences.'),
});
export type PredictiveEnergyUseInput = z.infer<typeof PredictiveEnergyUseInputSchema>;

const PredictiveEnergyUseOutputSchema = z.object({
  prediction: z.string().describe('Predicted future energy consumption.'),
  suggestions: z.string().describe('Suggestions for adjustments to reduce energy consumption.'),
});
export type PredictiveEnergyUseOutput = z.infer<typeof PredictiveEnergyUseOutputSchema>;

export async function predictEnergyUse(
  input: PredictiveEnergyUseInput
): Promise<PredictiveEnergyUseOutput> {
  return predictiveEnergyUseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictEnergyUsePrompt',
  input: {schema: PredictiveEnergyUseInputSchema},
  output: {schema: PredictiveEnergyUseOutputSchema},
  prompt: `You are an expert energy consumption predictor.

  Based on the historical energy consumption data, current date, and user preferences, predict future energy consumption and suggest adjustments to reduce energy consumption.

  Historical Data:
  {{historicalData}}

  Current Date: {{currentDate}}

  User Preferences: {{preferences}}

  Output the prediction and suggestions.
  Ensure that the predicted energy consumption is realistic.
  Ensure that the suggestions are practical.
  `,
});

const predictiveEnergyUseFlow = ai.defineFlow(
  {
    name: 'predictiveEnergyUseFlow',
    inputSchema: PredictiveEnergyUseInputSchema,
    outputSchema: PredictiveEnergyUseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
