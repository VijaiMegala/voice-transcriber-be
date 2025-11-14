import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { GenerateTokenDto } from './app/dto/generate-token.dto';
import { TranscriptDto } from './app/dto/transcript.dto';
import { FinalTranscriptDto } from './app/dto/final-transcript.dto';
import { TokenResponseDto } from './app/dto/token-response.dto';
import { TranscriptResponseDto } from './app/dto/transcript-response.dto';
import { FinalTranscriptResponseDto } from './app/dto/final-transcript-response.dto';

@ApiTags('app')
@ApiBearerAuth('access-token')
@Controller({ path: '', version: '1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns a simple hello message to verify the API is running',
  })
  @ApiResponse({
    status: 200,
    description: 'API is running',
    schema: {
      example: 'Hello World!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('livekit/token')
  @ApiOperation({
    summary: 'Generate LiveKit access token',
    description:
      'Generates a LiveKit access token for a participant to join a room',
  })
  @ApiBody({ type: GenerateTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Token generated successfully',
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  async generateToken(
    @Body() body: GenerateTokenDto,
  ): Promise<TokenResponseDto> {
    const token = await this.appService.generateLiveKitToken(
      body.roomName,
      body.participantName,
    );
    return {
      token,
      roomName: body.roomName,
    };
  }

  @Post('transcript')
  @ApiOperation({
    summary: 'Receive and process transcript chunk',
    description:
      'Receives a transcript chunk, stores it, and processes it with GROQ AI',
  })
  @ApiBody({ type: TranscriptDto })
  @ApiResponse({
    status: 201,
    description: 'Transcript received and processed successfully',
    type: TranscriptResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  async receiveTranscript(
    @Body() body: TranscriptDto,
  ): Promise<TranscriptResponseDto> {
    // Store transcript chunks as they come in
    this.appService.storeTranscript(body.roomName, body.transcript);

    // Process with GROQ if needed
    const processed = await this.appService.processTranscriptWithGroq(
      body.transcript,
    );

    return {
      success: true,
      processed,
    };
  }

  @Post('transcript/final')
  @ApiOperation({
    summary: 'Get final processed transcript',
    description:
      'Retrieves the final transcript for a room, processes it with GROQ AI, and clears the stored transcript',
  })
  @ApiBody({ type: FinalTranscriptDto })
  @ApiResponse({
    status: 200,
    description: 'Final transcript retrieved and processed successfully',
    type: FinalTranscriptResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  async getFinalTranscript(
    @Body() body: FinalTranscriptDto,
  ): Promise<FinalTranscriptResponseDto> {
    const transcript = this.appService.getTranscript(body.roomName);

    // If transcript is empty, return empty string instead of processing
    if (!transcript || !transcript.trim()) {
      return {
        transcript: '',
      };
    }

    // Process the final transcript with GROQ
    const processed =
      await this.appService.processTranscriptWithGroq(transcript);

    // Clear the stored transcript
    this.appService.clearTranscript(body.roomName);

    return {
      transcript: processed,
    };
  }
}
