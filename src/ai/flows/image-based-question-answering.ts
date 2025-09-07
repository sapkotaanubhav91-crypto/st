// 'use server';

/**
 * @fileOverview This flow allows users to upload an image and ask questions about it.
 *
 * - imageBasedQuestionAnswering - A function that accepts an image and a question, and returns an answer based on the image content.
 * - ImageBasedQuestionAnsweringInput - The input type for the imageBasedQuestionAnswering function.
 * - ImageBasedQuestionAnsweringOutput - The return type for the imageBasedQuestionAnswering function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageBasedQuestionAnsweringInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question about the image.'),
});
export type ImageBasedQuestionAnsweringInput = z.infer<typeof ImageBasedQuestionAnsweringInputSchema>;

const ImageBasedQuestionAnsweringOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the image.'),
});
export type ImageBasedQuestionAnsweringOutput = z.infer<typeof ImageBasedQuestionAnsweringOutputSchema>;

export async function imageBasedQuestionAnswering(
  input: ImageBasedQuestionAnsweringInput
): Promise<ImageBasedQuestionAnsweringOutput> {
  return imageBasedQuestionAnsweringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageBasedQuestionAnsweringPrompt',
  input: {schema: ImageBasedQuestionAnsweringInputSchema},
  output: {schema: ImageBasedQuestionAnsweringOutputSchema},
  prompt: `You are an AI assistant that answers questions about images.

  You will be given an image and a question about the image. You will answer the question based on the content of the image.

  Image: {{media url=photoDataUri}}
  Question: {{{question}}}

  Answer: `,
});

const imageBasedQuestionAnsweringFlow = ai.defineFlow(
  {
    name: 'imageBasedQuestionAnsweringFlow',
    inputSchema: ImageBasedQuestionAnsweringInputSchema,
    outputSchema: ImageBasedQuestionAnsweringOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
