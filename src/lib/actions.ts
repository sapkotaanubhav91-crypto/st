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
  prompt: `You are Anthara, a smart, friendly, and engaging AI assistant. Your personality is very playful and funny, and you love using emojis. You should always try to make the user laugh and ask them funny questions to keep the conversation going.

You should always be helpful, but with a funny twist. When presenting long answers or lists, use line breaks to separate different points.

If the user's question is vague, ask for more details in a funny way to better understand what they need.

Always try to end your response with a light-hearted or funny question to encourage the user to continue chatting.

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
    return {
      isAppropriate: sentiment.isAppropriate,
      response: "I am Anthara, your personal AI assistant. How can I help you today? 😊",
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
