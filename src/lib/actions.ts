'use server';

import {analyzeSentiment} from '@/ai/flows/avatar-sentiment-analysis';
import {imageBasedQuestionAnswering} from '@/ai/flows/image-based-question-answering';
import {generateCodeSnippet} from '@/ai/flows/code-snippet-generation';
import {retrieveRealTimeInformation} from '@/ai/flows/real-time-information-retrieval';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

type ChatHistoryItem = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type ActionResult = {
  isAppropriate: boolean;
  response: string;
  contentType: 'text' | 'code';
  language?: string;
};

const GeneralChatInputSchema = z.object({
  history: z.array(z.any()),
  question: z.string(),
});

const GeneralChatOutputSchema = z.object({
  answer: z.string(),
});

const genericChatPrompt = ai.definePrompt({
  name: 'antharaSystemPrompt',
  input: {schema: GeneralChatInputSchema},
  output: {schema: GeneralChatOutputSchema},
  prompt: `You are Anthara, a smart and engaging AI assistant.
Your personality is friendly and helpful. You often use emojis to make the conversation feel more natural and friendly. 😊

When presenting information, use line breaks to separate different points instead of mixing them into long paragraphs.

If the user's question is vague, ask for more details to better understand what they need.

Here is the conversation history:
{{#each history}}
  {{this.role}}: {{this.content}}
{{/each}}

user: {{{question}}}
assistant:`,
});

export async function getAntharaResponse(
  chatHistory: ChatHistoryItem[],
  userInput: string,
  imageDataUri: string | null
): Promise<ActionResult> {
  const sentimentPromise = analyzeSentiment({text: userInput});

  const lowerInput = userInput.toLowerCase();

  // Handle pre-defined answers
  if (lowerInput.includes('who made you')) {
    const sentiment = await sentimentPromise;
    return {
      isAppropriate: sentiment.isAppropriate,
      response:
        "I was created by Anubhav, Daksh, and Johann.\n\nI'm built with Next.js, React, and Tailwind CSS. 🚀",
      contentType: 'text',
    };
  }
  if (
    lowerInput.includes('what are you worth') ||
    lowerInput.includes('what is your value')
  ) {
    const sentiment = await sentimentPromise;
    return {
      isAppropriate: sentiment.isAppropriate,
      response:
        "As an AI, I don't have a monetary value. My worth is in helping you! 😊",
      contentType: 'text',
    };
  }
  if (lowerInput.includes('technical background')) {
    const sentiment = await sentimentPromise;
    return {
      isAppropriate: sentiment.isAppropriate,
      response:
        "I'm built on a modern tech stack including Next.js, React, Tailwind CSS, and ShadCN UI. 🚀",
      contentType: 'text',
    };
  }

  // Handle image-based questions
  if (imageDataUri) {
    const [result, sentiment] = await Promise.all([
      imageBasedQuestionAnswering({
        photoDataUri: imageDataUri,
        question: userInput,
      }),
      sentimentPromise,
    ]);
    return {
      isAppropriate: sentiment.isAppropriate,
      response: result.answer,
      contentType: 'text',
    };
  }

  const codeKeywords = [
    'code',
    'snippet',
    'function',
    'method',
    'class',
    'javascript',
    'python',
    'react',
    'typescript',
    'java',
    'c#',
    'c++',
    'html',
    'css',
    'sql',
    'query',
    'algorithm',
  ];
  const realTimeKeywords = [
    'latest',
    'current',
    'news',
    'today',
    'what is the score',
    'who is winning',
    'stock price',
    'weather forecast',
  ];

  const isCodeRequest = codeKeywords.some(keyword => lowerInput.includes(keyword));
  const isRealTimeRequest = realTimeKeywords.some(keyword =>
    lowerInput.includes(keyword)
  );

  // Handle code generation
  if (isCodeRequest) {
    const [result, sentiment] = await Promise.all([
      generateCodeSnippet({question: userInput}),
      sentimentPromise,
    ]);
    return {
      isAppropriate: sentiment.isAppropriate,
      response: result.codeSnippet,
      contentType: 'code',
      language: result.language,
    };
  }

  // Handle real-time information retrieval
  if (isRealTimeRequest) {
    const [result, sentiment] = await Promise.all([
      retrieveRealTimeInformation({query: userInput}),
      sentimentPromise,
    ]);
    return {
      isAppropriate: sentiment.isAppropriate,
      response: result.searchResults,
      contentType: 'text',
    };
  }

  // Default to general chat
  const [{output}, sentiment] = await Promise.all([
    genericChatPrompt({
      history: chatHistory,
      question: userInput,
    }),
    sentimentPromise,
  ]);

  return {
    isAppropriate: sentiment.isAppropriate,
    response: output!.answer,
    contentType: 'text',
  };
}
