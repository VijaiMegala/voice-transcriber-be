import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AppService {
  private groqClient: Groq | null = null;
  private transcriptStore: Map<string, string> = new Map();

  constructor() {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.warn('GROQ_API_KEY is not set. Transcription will not work.');
    } else {
      this.groqClient = new Groq({
        apiKey: groqApiKey,
      });
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async generateLiveKitToken(
    roomName: string,
    participantName: string,
  ): Promise<string> {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('LiveKit API key or secret is not configured');
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return await at.toJwt();
  }

  async processTranscriptWithGroq(text: string): Promise<string> {
    // Don't process empty or whitespace-only transcripts
    if (!text || !text.trim()) {
      return text;
    }

    if (!this.groqClient) {
      return text; // Return original text if GROQ is not configured
    }

    try {
      // Use GROQ to enhance/process the transcript
      // Reference: https://console.groq.com/docs/text-chat
      const completion = await this.groqClient.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that improves and formats transcripts. Return only the improved transcript without any additional commentary. If the transcript is empty or meaningless, return it as-is.',
          },
          {
            role: 'user',
            content: `Please improve and format this transcript: ${text}`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
      });

      const processed = completion.choices[0]?.message?.content || text;

      // Don't return GROQ's error messages
      if (
        processed.includes('There is no transcript') ||
        processed.includes('no transcript provided')
      ) {
        return text; // Return original instead
      }

      return processed;
    } catch (error) {
      console.error('Error processing transcript with GROQ:', error);
      return text; // Return original text on error
    }
  }

  storeTranscript(roomName: string, transcript: string) {
    const existing = this.transcriptStore.get(roomName) || '';
    this.transcriptStore.set(roomName, existing + ' ' + transcript);
  }

  getTranscript(roomName: string): string {
    return this.transcriptStore.get(roomName) || '';
  }

  clearTranscript(roomName: string) {
    this.transcriptStore.delete(roomName);
  }
}
