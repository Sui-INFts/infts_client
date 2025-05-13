import { useState } from 'react';
import atomaSDK from '../app/utils/atomaClient';

export default function useAtomaChat() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChat = async (message: string) => {
    try {
      setIsLoading(true);
      setError('');
      const completion = await atomaSDK.chat.create({
        messages: [
          { role: "developer", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ],
        model: "Infermatic/Llama-3.3-70B-Instruct-FP8-Dynamic"
      });
      setResponse(completion.choices[0].message.content);
    } catch (err) {
      setError('Error: ' + (err instanceof Error ? err.message : 'Failed to process chat request.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfidentialChat = async (message: string) => {
    try {
      setIsLoading(true);
      setError('');
      const completion = await atomaSDK.confidentialChat.create({
        messages: [
          { role: "developer", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ],
        model: "Infermatic/Llama-3.3-70B-Instruct-FP8-Dynamic"
      });
      setResponse(completion.choices[0].message.content);
    } catch (err) {
      setError('Error: ' + (err instanceof Error ? err.message : 'Failed to process confidential chat request.'));
    } finally {
      setIsLoading(false);
    }
  };

  return { response, error, handleChat, handleConfidentialChat, isLoading };
}