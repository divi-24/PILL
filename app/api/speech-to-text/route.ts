import { NextResponse } from "next/server";

interface SpeechResponse {
  text: string;
  error?: string;
}
interface GoogleSpeechResponse {
    results: Array<{
      alternatives: Array<{
        transcript: string;
        confidence: number;
      }>;
    }>;
    error?: {
      message: string;
      code: number;
    };
  }

export async function POST(req: Request) {
    try {
        const { audio } = await req.json();

        if (!audio) {
            return NextResponse.json(
                { error: "No audio data provided" },
                { status: 400 }
            );
        }

        // Create the request body for Google Cloud Speech-to-Text API
        const requestBody = {
            audio: {
                content: audio
            },
            config: {
                encoding: "WEBM_OPUS",
                sampleRateHertz: 48000,
                languageCode: "en-US",
                model: "default",
                useEnhanced: true
            }
        };

        // Call the Google Cloud Speech-to-Text API
        const response = await fetch(
            `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Speech-to-text API error:', errorData);
            throw new Error(errorData.error?.message || 'Failed to convert speech to text');
        }

        const data = await response.json() as GoogleSpeechResponse;
        
        if (!data.results || data.results.length === 0) {
            throw new Error('No transcription results found');
        }

        return NextResponse.json({ 
            text: data.results[0].alternatives[0].transcript 
        });
    } catch (error: any) {
        console.error('Speech-to-text error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to convert speech to text' },
            { status: 500 }
        );
    }
} 