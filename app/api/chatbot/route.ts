import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Get API key from environment variable
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    console.error("GOOGLE_API_KEY is not set in environment variables");
}

// Initialize Gemini API with proper error handling
let genAI: GoogleGenerativeAI | undefined;
try {
    if (!API_KEY) {
        throw new Error("API key is not configured");
    }
    // Initialize with the API key directly
    genAI = new GoogleGenerativeAI(API_KEY.trim());
} catch (error) {
    console.error("Failed to initialize Gemini API:", error);
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  error?: string;
}

// Helper function to create response with CORS headers
const corsResponse = (data: any, status: number = 200) => {
    return NextResponse.json(data, {
        status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        },
    });
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
    return corsResponse({}, 200);
}

export async function POST(req: Request) {
    try {
        console.log("Received request to /api/chatbot");
        console.log("API Key present:", !!API_KEY);
        console.log("API Key length:", API_KEY?.length);
        
        if (!API_KEY) {
            console.error("API Key is missing");
            return corsResponse(
                { 
                    reply: "The AI service is not properly configured. Please contact support.",
                    error: "API configuration error"
                },
                503
            );
        }

        if (!genAI) {
            console.error("genAI is not initialized");
            return corsResponse(
                { 
                    reply: "The AI service is not properly initialized. Please try again later.",
                    error: "API initialization error"
                },
                503
            );
        }

        const { message } = await req.json();
        console.log("Received message:", message);

        if (!message) {
            console.error("No message provided");
            return corsResponse(
                { 
                    reply: "Please provide a message to get a response.",
                    error: "Missing message"
                },
                400
            );
        }

        // Initialize the model with error handling
        let model;
        try {
            console.log("Initializing Gemini model...");
            // Use the correct model name
            model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            console.log("Model initialized successfully");
        } catch (error: any) {
            console.error("Failed to initialize model:", {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            return corsResponse(
                { 
                    reply: "Failed to initialize the AI model. Please try again later.",
                    error: "Model initialization error"
                },
                503
            );
        }

        try {
            // Generate response with detailed error logging
            console.log("Sending request to Gemini API...");
            const result = await model.generateContent(message as ChatMessage[]);
            console.log("Received response from Gemini API");
            
            if (!result || !result.response) {
                console.error("Invalid response structure:", result);
                throw new Error("Invalid response from Gemini API");
            }

            const response = await result.response;
            const text = response.text();

            if (!text) {
                console.error("Empty response text");
                throw new Error("Empty response from Gemini API");
            }

            return corsResponse({ reply: text });
        } catch (apiError: any) {
            console.error("Gemini API Error Details:", {
                message: apiError.message,
                code: apiError.code,
                stack: apiError.stack,
                name: apiError.name,
                cause: apiError.cause
            });
            
            // Handle specific Gemini API errors
            if (apiError.message?.includes("quota")) {
                return corsResponse(
                    { 
                        reply: "I apologize, but I'm currently experiencing high demand. Please try again in a few minutes.",
                        error: "API quota exceeded"
                    },
                    429
                );
            }

            if (apiError.message?.includes("API key") || apiError.message?.includes("authentication")) {
                return corsResponse(
                    { 
                        reply: "There's an issue with the AI service configuration. Please try again later.",
                        error: "API configuration error"
                    },
                    503
                );
            }

            if (apiError.message?.includes("network") || apiError.message?.includes("connection")) {
                return corsResponse(
                    { 
                        reply: "I'm having trouble connecting to the AI service. Please check your internet connection and try again.",
                        error: "API connection error"
                    },
                    503
                );
            }

            throw apiError;
        }
    } catch (error: any) {
        console.error("General Error Details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause
        });
        
        return corsResponse(
            { 
                reply: "I apologize, but I'm having trouble processing your request. Please try again later.",
                error: "General error"
            },
            500
        );
    }
}
