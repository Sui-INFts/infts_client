import { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const useIOChat = () => {
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChat = async (message: string, instructions: string, chatHistory: ChatMessage[] = []) => {
    if (!message || !instructions) {
      console.error('Invalid input:', { message, instructions });
      setError('Message and instructions are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending request to /api/chat:', { message, instructions, chatHistory });
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, instructions, chatHistory }),
      });

      const data = await res.json();
      console.log('Received response from /api/chat:', data);

      if (res.ok && data.choices && data.choices[0]?.message?.content) {
        setResponse(data.choices[0].message.content);
      } else {
        setError(data.error || 'Failed to get a response from the API.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to connect to the API. Please check your network or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return { response, error, handleChat, isLoading };
};

export default useIOChat;