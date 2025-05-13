import { NextRequest, NextResponse } from 'next/server';

const WALRUS_PUBLISHER_URL = "https://publisher.walrus-01.tududes.com";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const suiAddress = formData.get('suiAddress') as string;
    const suiNetwork = formData.get('suiNetwork') as string;

    if (!file || !suiAddress || !suiNetwork) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await fetch(`${WALRUS_PUBLISHER_URL}/v1/blobs?epochs=5`, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'X-Sui-Address': suiAddress,
        'X-Sui-Network': suiNetwork,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Upload failed: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 