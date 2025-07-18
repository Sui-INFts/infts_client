import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, instructions } = req.body;

  if (!message || !instructions) {
    return res.status(400).json({ error: 'Message and instructions are required' });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.IOINTELLIGENCE_API_KEY || '',
      baseURL: 'https://api.intelligence.io.solutions/api/v1/',
    });

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
      res.status(200).json({ response: responseContent });
    } else {
      res.status(500).json({ error: 'No response content received from the API' });
    }
  } catch (error: unknown) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to fetch response from API: ${errorMessage}` });
  }
}