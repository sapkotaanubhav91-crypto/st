'use server';

/**
 * @fileOverview Code snippet generation flow.
 *
 * - generateCodeSnippet - A function that generates code snippets based on user questions.
 * - CodeSnippetGenerationInput - The input type for the generateCodeSnippet function.
 * - CodeSnippetGenerationOutput - The return type for the generateCodeSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeSnippetGenerationInputSchema = z.object({
  question: z.string().describe('The technical question asked by the user.'),
});

export type CodeSnippetGenerationInput = z.infer<
  typeof CodeSnippetGenerationInputSchema
>;

const CodeSnippetGenerationOutputSchema = z.object({
  codeSnippet: z.string().describe('The generated code snippet.'),
  language: z.string().describe('The programming language of the code snippet.'),
});

export type CodeSnippetGenerationOutput = z.infer<
  typeof CodeSnippetGenerationOutputSchema
>;

export async function generateCodeSnippet(
  input: CodeSnippetGenerationInput
): Promise<CodeSnippetGenerationOutput> {
  return codeSnippetGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeSnippetGenerationPrompt',
  input: {schema: CodeSnippetGenerationInputSchema},
  output: {schema: CodeSnippetGenerationOutputSchema},
  prompt: `You are a code generation AI. A user will ask a question, and you will respond with a code snippet that answers the question.  Enclose the code snippet in triple backticks, followed by the language of the code. For example:

Question: How do I sort an array in Javascript?

Response:
```javascript
const arr = [3, 1, 4, 1, 5, 9, 2, 6];
arr.sort((a, b) => a - b);
console.log(arr);
```

Question: {{{question}}}`,
});

const codeSnippetGenerationFlow = ai.defineFlow(
  {
    name: 'codeSnippetGenerationFlow',
    inputSchema: CodeSnippetGenerationInputSchema,
    outputSchema: CodeSnippetGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
