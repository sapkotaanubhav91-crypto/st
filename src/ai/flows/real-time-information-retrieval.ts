'use server';
/**
 * @fileOverview A flow that retrieves real-time information from the internet.
 *
 * - retrieveRealTimeInformation - A function that retrieves real-time information based on a query.
 * - RetrieveRealTimeInformationInput - The input type for the retrieveRealTimeInformation function.
 * - RetrieveRealTimeInformationOutput - The return type for the retrieveRealTimeInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetrieveRealTimeInformationInputSchema = z.object({
  query: z.string().describe('The search query for real-time information.'),
});
export type RetrieveRealTimeInformationInput = z.infer<
  typeof RetrieveRealTimeInformationInputSchema
>;

const RetrieveRealTimeInformationOutputSchema = z.object({
  searchResults: z
    .string()
    .describe('The search results from the real-time information retrieval.'),
});
export type RetrieveRealTimeInformationOutput = z.infer<
  typeof RetrieveRealTimeInformationOutputSchema
>;

export async function retrieveRealTimeInformation(
  input: RetrieveRealTimeInformationInput
): Promise<RetrieveRealTimeInformationOutput> {
  return retrieveRealTimeInformationFlow(input);
}

const searchInternet = ai.defineTool(
  {
    name: 'searchInternet',
    description:
      'Searches the internet for the given query using Google Search and returns the results.',
    inputSchema: z.object({
      query: z.string(),
    }),
    outputSchema: z.unknown(),
  },
  async (input) => {
    console.log(`Searching internet for: ${input.query}`);
    // This is a simplified implementation that uses Gemini's built-in search.
    // In a production app, you might use a dedicated search API for more control.
    const result = await ai.generate({
      prompt: `Search the internet for: ${input.query}`,
      tools: [], // No tools needed for the search itself
      config: {
        tools: ['googleSearch'],
      },
    });
    return result.text;
  }
);

const retrieveRealTimeInformationPrompt = ai.definePrompt({
  name: 'retrieveRealTimeInformationPrompt',
  input: {schema: RetrieveRealTimeInformationInputSchema},
  output: {schema: RetrieveRealTimeInformationOutputSchema},
  tools: [searchInternet],
  prompt: `You are an AI assistant that retrieves real-time information from the internet based on the user's query.

  Use the searchInternet tool to search for the information.

  Query: {{{query}}}

  Summarize the information you find and present it to the user. Do not just repeat the search results. If the tool doesn't find anything, say that you couldn't find any information.`,
});

const retrieveRealTimeInformationFlow = ai.defineFlow(
  {
    name: 'retrieveRealTimeInformationFlow',
    inputSchema: RetrieveRealTimeInformationInputSchema,
    outputSchema: RetrieveRealTimeInformationOutputSchema,
  },
  async input => {
    const {output} = await retrieveRealTimeInformationPrompt(input);
    return output!;
  }
);
