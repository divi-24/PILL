import { NextResponse } from "next/server";
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";

// Initialize the client with credentials
const client = new TextToSpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    // Configure the synthesis input
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    
      input: { text },
      voice: {
        languageCode: "en-US",
        name: "en-US-Neural2-J",
        ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
      },
      audioConfig: {
        audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
        speakingRate: 1.0,
        pitch: 0,
      },
    };

    // Perform the text-to-speech request
    const response = await client.synthesizeSpeech(request);
    const audioContent = Buffer.from(response[0].audioContent || '').toString('base64');
    if (!audioContent) {
      throw new Error("No audio content received");
    }

    return NextResponse.json({ audioContent });
  } catch (error: any) {
    console.error("Text-to-speech API error:", {
      error: error.response?.data || error.message,
      code: error.code,
      status: error.status,
    });

    // Handle specific error cases
    if (error.code === 403) {
      return NextResponse.json(
        { 
          error: "Text-to-speech API is not enabled. Please enable it in the Google Cloud Console.",
          details: error.message
        },
        { status: 403 }
      );
    }

    if (error.code === 401) {
      return NextResponse.json(
        { 
          error: "Authentication failed. Please check your Google Cloud credentials.",
          details: error.message
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to convert text to speech",
        details: error.message
      },
      { status: 500 }
    );
  }
} 