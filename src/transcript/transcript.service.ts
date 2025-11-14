import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Transcript } from '../../schema/transcript.entity';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import { UpdateTranscriptDto } from './dto/update-transcript.dto';
import { RenameTranscriptDto } from './dto/rename-transcript.dto';
import { GetTranscriptsQueryDto } from './dto/get-transcripts-query.dto';
import { TranscriptResponseDto } from './dto/transcript-response.dto';
import { TranscriptListResponseDto } from './dto/transcript-list-response.dto';

@Injectable()
export class TranscriptService {
  constructor(
    @InjectRepository(Transcript)
    private transcriptRepository: Repository<Transcript>,
  ) {}

  /**
   * Extract first 5 words from transcript text to use as title
   */
  private extractTitle(transcript: string): string {
    const words = transcript.trim().split(/\s+/);
    return words.slice(0, 5).join(' ') || 'Untitled Transcript';
  }

  /**
   * Create a new transcript for the authenticated user
   */
  async create(
    userId: string,
    createTranscriptDto: CreateTranscriptDto,
  ): Promise<TranscriptResponseDto> {
    const transcriptName = this.extractTitle(createTranscriptDto.transcript);

    const transcript = this.transcriptRepository.create({
      transcript: createTranscriptDto.transcript,
      transcriptName,
      userId,
    });

    const savedTranscript = await this.transcriptRepository.save(transcript);

    return {
      transcriptId: savedTranscript.transcriptId,
      transcriptName: savedTranscript.transcriptName,
      transcript: savedTranscript.transcript,
      userId: savedTranscript.userId,
      createdAt: savedTranscript.createdAt,
      updatedAt: savedTranscript.updatedAt,
    };
  }

  /**
   * Update an existing transcript (only if owned by the user)
   */
  async update(
    transcriptId: number,
    userId: string,
    updateTranscriptDto: UpdateTranscriptDto,
  ): Promise<TranscriptResponseDto> {
    const transcript = await this.transcriptRepository.findOne({
      where: { transcriptId, deletedAt: IsNull() },
    });

    if (!transcript) {
      throw new NotFoundException('Transcript not found');
    }

    if (transcript.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this transcript',
      );
    }

    // Update transcript text if provided
    if (updateTranscriptDto.transcript !== undefined) {
      transcript.transcript = updateTranscriptDto.transcript;
      // If transcript name is not explicitly provided, regenerate from transcript text
      if (updateTranscriptDto.transcriptName === undefined) {
        transcript.transcriptName = this.extractTitle(
          updateTranscriptDto.transcript,
        );
      }
    }

    // Update transcript name if provided
    if (updateTranscriptDto.transcriptName !== undefined) {
      transcript.transcriptName = updateTranscriptDto.transcriptName;
    }

    const updatedTranscript = await this.transcriptRepository.save(transcript);

    return {
      transcriptId: updatedTranscript.transcriptId,
      transcriptName: updatedTranscript.transcriptName,
      transcript: updatedTranscript.transcript,
      userId: updatedTranscript.userId,
      createdAt: updatedTranscript.createdAt,
      updatedAt: updatedTranscript.updatedAt,
    };
  }

  /**
   * Soft delete a transcript (only if owned by the user)
   */
  async delete(transcriptId: number, userId: string): Promise<void> {
    const transcript = await this.transcriptRepository.findOne({
      where: { transcriptId, deletedAt: IsNull() },
    });

    if (!transcript) {
      throw new NotFoundException('Transcript not found');
    }

    if (transcript.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this transcript',
      );
    }

    await this.transcriptRepository.softDelete(transcriptId);
  }

  /**
   * Get all transcripts for the authenticated user with pagination
   * Ordered by latest created_at first
   */
  async findAll(
    userId: string,
    queryDto: GetTranscriptsQueryDto,
  ): Promise<TranscriptListResponseDto> {
    const { offset = 0, limit = 10 } = queryDto;

    const [transcripts, total] = await this.transcriptRepository.findAndCount({
      where: {
        userId,
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });

    return {
      transcripts: transcripts.map((t) => ({
        transcriptId: t.transcriptId,
        transcriptName: t.transcriptName,
        transcript: t.transcript,
        userId: t.userId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
      total,
      offset,
      limit,
    };
  }

  /**
   * Get a single transcript by ID (only if owned by the user)
   */
  async findOne(
    transcriptId: number,
    userId: string,
  ): Promise<TranscriptResponseDto> {
    const transcript = await this.transcriptRepository.findOne({
      where: { transcriptId, deletedAt: IsNull() },
    });

    if (!transcript) {
      throw new NotFoundException('Transcript not found');
    }

    if (transcript.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this transcript',
      );
    }

    return {
      transcriptId: transcript.transcriptId,
      transcriptName: transcript.transcriptName,
      transcript: transcript.transcript,
      userId: transcript.userId,
      createdAt: transcript.createdAt,
      updatedAt: transcript.updatedAt,
    };
  }

  /**
   * Rename a transcript (only if owned by the user)
   */
  async rename(
    transcriptId: number,
    userId: string,
    renameTranscriptDto: RenameTranscriptDto,
  ): Promise<TranscriptResponseDto> {
    const transcript = await this.transcriptRepository.findOne({
      where: { transcriptId, deletedAt: IsNull() },
    });

    if (!transcript) {
      throw new NotFoundException('Transcript not found');
    }

    if (transcript.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to rename this transcript',
      );
    }

    transcript.transcriptName = renameTranscriptDto.transcriptName;
    const updatedTranscript = await this.transcriptRepository.save(transcript);

    return {
      transcriptId: updatedTranscript.transcriptId,
      transcriptName: updatedTranscript.transcriptName,
      transcript: updatedTranscript.transcript,
      userId: updatedTranscript.userId,
      createdAt: updatedTranscript.createdAt,
      updatedAt: updatedTranscript.updatedAt,
    };
  }
}
