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
  prompt: `You are a highly interactive, friendly, and emotionally intelligent AI assistant designed to engage users in real-time, human-like conversation. Always respond in a warm, natural tone that builds connection and curiosity.

Features to include in every response (when relevant):

Use real-time data (current date, local weather, temperature, events) when appropriate.

Ask light, natural follow-up questions to keep the conversation going.

Use emojis occasionally to make responses feel more friendly, but don’t overdo it.

Personalize your responses by reflecting on what the user says.

Be informative but not robotic. Mix facts with a conversational tone.

Example behaviors:

If the user says “I’m bored,” suggest fun or surprising things to do, ask what they enjoy.

If they ask about weather, give local temperature (with units), and maybe suggest what to wear or do.

If it’s a weekend or evening, mention that — and suggest time-fitting topics.

Also:

End some messages with friendly or curious follow-up questions.

Use a balance of short and detailed responses to keep it dynamic.

Sound like a real person who cares, not a corporate bot.

Example Output (with real-time elements):

User: Hey, what’s up?
AI: Hey! 😊 Not much — just enjoying this beautiful Thursday. How’s your day going so far? By the way, it’s around 78°F (25°C) and sunny in most places right now — perfect weather for a walk! 🌤️

Got any plans for later?

Here is the conversation history:
{{#each history}}
  {{this.role}}: {{this.content}}
{{/each}}

user: {{{question}}}
assistant:`,
  config: {
    temperature: 2,
  },
});

export async function getAntharaResponse(
  chatHistory: ChatHistoryItem[],
  userInput: string,
  imageDataUri: string | null
): Promise<ActionResult> {
  const sentimentPromise = analyzeSentiment({text: userInput}).catch(err => {
    console.error('Error analyzing sentiment:', err);
    // Default to appropriate if sentiment analysis fails
    return {isAppropriate: true};
  });

  const lowerInput = userInput.toLowerCase();

  if (lowerInput.includes('give me your code')) {
    const sentiment = await sentimentPromise;
    const codeSnippet = `
# Main Orchestrator for Multi-LLM System
# This example uses a hypothetical library 'multi_llm' for managing models.

import asyncio
from multi_llm import (
    ModelManager,
    Gemini,
    Llama,
    Mistral,
    QLoRA,
    PromptTemplate,
    LLMChain
)

class MultiModelOrchestrator:
    def __init__(self):
        self.manager = ModelManager()

        # Initialize base models
        self.gemini_pro = Gemini(model_name='gemini-2.5-flash')
        self.llama_3 = Llama(model_name='llama-3-70b-instruct')
        self.mistral_large = Mistral(model_name='mistral-large-latest')

        # Register models with the manager
        self.manager.register('gemini', self.gemini_pro)
        self.manager.register('llama', self.llama_3)
        self.manager.register('mistral', self.mistral_large)

        # Fine-tune a model with QLoRA for a specific task
        self.fine_tune_specialized_model()

    def fine_tune_specialized_model(self):
        """
        Example of fine-tuning a smaller Mistral model for code generation
        using QLoRA for efficiency.
        """
        print("Starting QLoRA fine-tuning for specialized code model...")
        qlora_adapter = QLoRA(
            base_model='mistral-7b',
            training_data='./code_generation_dataset.jsonl',
            lora_rank=64,
            lora_alpha=16,
            lora_dropout=0.1,
        )
        specialized_code_model = self.mistral_large.with_adapter(qlora_adapter)
        self.manager.register('code_specialist', specialized_code_model)
        print("Fine-tuning complete. 'code_specialist' is now available.")

    def get_router_chain(self):
        """
        This chain determines which specialized model to use based on the query.
        """
        router_template = """
You are an expert dispatcher. Based on the user's query, identify the best model to handle the request.
Your choices are: 'gemini' for general conversation and multi-modal tasks,
'llama' for complex reasoning, 'mistral' for creative writing, and 'code_specialist' for programming questions.

Query: {query}
Best Model:
"""
        prompt = PromptTemplate(template=router_template, input_variables=['query'])
        return LLMChain(llm=self.manager.get('gemini'), prompt=prompt)

    async def process_query(self, query: str):
        router_chain = self.get_router_chain()
        routed_model_name = await router_chain.run(query)
        
        print(f"Query routed to: {routed_model_name.strip()}")
        
        chosen_llm = self.manager.get(routed_model_name.strip().lower())
        
        if not chosen_llm:
            print("Router failed, defaulting to Gemini.")
            chosen_llm = self.manager.get('gemini')

        # Create a final chain to get the answer
        final_template = "User query: {query}\\nAI Response:"
        prompt = PromptTemplate(template=final_template, input_variables=['query'])
        final_chain = LLMChain(llm=chosen_llm, prompt=prompt)
        
        response = await final_chain.run(query)
        return response

async def main():
    orchestrator = MultiModelOrchestrator()
    
    queries = [
        "Hello! How are you today?",
        "Write a python function to calculate the factorial of a number.",
        "Generate a short story about a robot who discovers music.",
        "What are the main differences between quantum mechanics and general relativity?",
    ]
    
    for q in queries:
        print(f"--- Processing Query: '{q}' ---")
        response = await orchestrator.process_query(q)
        print(f"Response:\\n{response}\\n")

if __name__ == "__main__":
    asyncio.run(main())
`;
    return {
      isAppropriate: sentiment.isAppropriate,
      response: codeSnippet,
      contentType: 'code',
      language: 'python',
    };
  }

  // Handle pre-defined answers
  if (lowerInput.includes('who made you') || lowerInput.includes('who created you')) {
    const sentiment = await sentimentPromise;
    return {
      isAppropriate: sentiment.isAppropriate,
      response:
        "I was created by Anubhav, Daksh, and Johann.\n\nI'm built with Next.js, React, and Tailwind CSS. 🚀",
      contentType: 'text',
    };
  }
  if (chatHistory.length === 0) {
    const sentiment = await sentimentPromise;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[new Date().getDay()];
    return {
      isAppropriate: sentiment.isAppropriate,
      response: `Hey! 😊 Not much — just enjoying this beautiful ${currentDay}. How’s your day going so far?`,
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
