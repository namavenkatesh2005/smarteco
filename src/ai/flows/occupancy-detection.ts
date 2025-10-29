'use server';

/**
 * @fileOverview Determines the number of occupants in a room using machine learning analysis of camera input.
 *
 * - occupancyDetection - A function that handles the occupancy detection process.
 * - OccupancyDetectionInput - The input type for the occupancyDetection function.
 * - OccupancyDetectionOutput - The return type for the occupancyDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OccupancyDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OccupancyDetectionInput = z.infer<typeof OccupancyDetectionInputSchema>;

const OccupancyDetectionOutputSchema = z.object({
  occupantCount: z
    .number()
    .describe('The number of occupants detected in the room.'),
});
export type OccupancyDetectionOutput = z.infer<typeof OccupancyDetectionOutputSchema>;

export async function occupancyDetection(input: OccupancyDetectionInput): Promise<OccupancyDetectionOutput> {
  return occupancyDetectionFlow(input);
}

const occupancyDetectionPrompt = ai.definePrompt({
  name: 'occupancyDetectionPrompt',
  input: {schema: OccupancyDetectionInputSchema},
  output: {schema: OccupancyDetectionOutputSchema},
  prompt: `You are an AI that analyzes images to determine the number of occupants in a room.

  Analyze the provided image and determine the number of people present. Optimize for privacy by focusing only on detecting human presence and quantity.

  Image: {{media url=photoDataUri}}

  Return ONLY the number of occupants.`,
});

const occupancyDetectionFlow = ai.defineFlow(
  {
    name: 'occupancyDetectionFlow',
    inputSchema: OccupancyDetectionInputSchema,
    outputSchema: OccupancyDetectionOutputSchema,
  },
  async input => {
    const {output} = await occupancyDetectionPrompt(input);
    return output!;
  }
);
