import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message, instructions, chatHistory } = await request.json();

  if (!message || !instructions) {
    console.error('Missing parameters:', { message, instructions });
    return NextResponse.json({ error: 'Message and instructions are required' }, { status: 400 });
  }

  try {
    const messages = [
      { role: 'system', content: instructions },
      ...(chatHistory || []).map((chat: { role: string; content: string }) => ({ role: chat.role, content: chat.content })),
      { role: 'user', content: message },
    ];

    console.log('Sending request to IO Intelligence API:', { messages });

    const response = await fetch('https://api.intelligence.io.solutions/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.IOINTELLIGENCE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct',
        messages,
        temperature: 0.7,
        stream: false,
        max_completion_tokens: 50,
      }),
    });

    const data = await response.json();
    console.log('Received response:', data);

    if (!response.ok) {
      console.error('API response error:', data);
      return NextResponse.json({ error: data.error || 'Failed to fetch response' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('API Error:', errorMessage);
    return NextResponse.json({ error: `Failed to fetch response: ${errorMessage}` }, { status: 500 });
  }
}