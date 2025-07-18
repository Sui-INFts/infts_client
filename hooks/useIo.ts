import { useState } from 'react';
import { OpenAI } from 'openai';

// interface ChatMessage {
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: number;
// }

const useIOChat = () => {
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const client = new OpenAI({
    apiKey: process.env.IOINTELLIGENCE_API_KEY || '',
    baseURL: 'https://api.intelligence.io.solutions/api/v1/',
    dangerouslyAllowBrowser: true, // Note: For production, handle API key securely on the backend
  });

  const handleChat = async (message: string, instructions: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const completion = await client.chat.completions.create({
        model: 'meta-llama/Llama-3.3-70B-Instruct',
        messages: [
          { role: 'system', content: instructions },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        stream: false,
        max_completion_tokens: 50,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (responseContent) {
        setResponse(responseContent);
      } else {
        setError('No response content received from the API.');
      }
    } catch (err) {
      console.error('Error interacting with IO Intelligence API:', err);
      setError('Failed to get a response from the API. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { response, error, handleChat, isLoading };
};

export default useIOChat;