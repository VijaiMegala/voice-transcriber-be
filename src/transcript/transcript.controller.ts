import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { TranscriptService } from './transcript.service';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import { UpdateTranscriptDto } from './dto/update-transcript.dto';
import { RenameTranscriptDto } from './dto/rename-transcript.dto';
import { GetTranscriptsQueryDto } from './dto/get-transcripts-query.dto';
import { TranscriptResponseDto } from './dto/transcript-response.dto';
import { TranscriptListResponseDto } from './dto/transcript-list-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/strategies/jwt.strategy';

@ApiTags('transcript')
@ApiBearerAuth('access-token')
@Controller({ path: 'transcript', version: '1' })
export class TranscriptController {
  constructor(private readonly transcriptService: TranscriptService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new transcript',
    description:
      'Creates a new transcript for the authenticated user. The title is automatically generated from the first 5 words of the transcript text.',
  })
  @ApiBody({ type: CreateTranscriptDto })
  @ApiResponse({
    status: 201,
    description: 'Transcript successfully created',
    type: TranscriptResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'transcript must be a string',
          'transcript should not be empty',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  async create(
    @Body() createTranscriptDto: CreateTranscriptDto,
    @CurrentUser() user: RequestUser,
  ): Promise<TranscriptResponseDto> {
    return await this.transcriptService.create(
      user.userId,
      createTranscriptDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all transcripts',
    description:
      'Retrieves all transcripts for the authenticated user, ordered by latest created_at first. Supports pagination with offset and limit query parameters.',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of records to skip',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of records to return',
  })
  @ApiResponse({
    status: 200,
    description: 'Transcripts retrieved successfully',
    type: TranscriptListResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  async findAll(
    @Query() queryDto: GetTranscriptsQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<TranscriptListResponseDto> {
    return await this.transcriptService.findAll(user.userId, queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a single transcript by ID',
    description:
      'Retrieves a specific transcript by its ID. Only accessible if owned by the authenticated user.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Transcript ID' })
  @ApiResponse({
    status: 200,
    description: 'Transcript retrieved successfully',
    type: TranscriptResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Transcript not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Transcript not found',
        error: 'Not Found',
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to view this transcript',
    schema: {
      example: {
        statusCode: 403,
        message: 'You do not have permission to view this transcript',
        error: 'Forbidden',
      },
    },
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestUser,
  ): Promise<TranscriptResponseDto> {
    return await this.transcriptService.findOne(id, user.userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a transcript',
    description:
      'Updates an existing transcript. Only the transcript owner can update it. If transcript text is updated without providing a name, the title will be regenerated from the first 5 words.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Transcript ID' })
  @ApiBody({ type: UpdateTranscriptDto })
  @ApiResponse({
    status: 200,
    description: 'Transcript successfully updated',
    type: TranscriptResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['transcript must be a string'],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Transcript not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Transcript not found',
        error: 'Not Found',
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to update this transcript',
    schema: {
      example: {
        statusCode: 403,
        message: 'You do not have permission to update this transcript',
        error: 'Forbidden',
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTranscriptDto: UpdateTranscriptDto,
    @CurrentUser() user: RequestUser,
  ): Promise<TranscriptResponseDto> {
    return await this.transcriptService.update(
      id,
      user.userId,
      updateTranscriptDto,
    );
  }

  @Patch(':id/rename')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rename a transcript',
    description:
      'Renames the transcript title. Only the transcript owner can rename it.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Transcript ID' })
  @ApiBody({ type: RenameTranscriptDto })
  @ApiResponse({
    status: 200,
    description: 'Transcript successfully renamed',
    type: TranscriptResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'transcriptName must be a string',
          'transcriptName should not be empty',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Transcript not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Transcript not found',
        error: 'Not Found',
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to rename this transcript',
    schema: {
      example: {
        statusCode: 403,
        message: 'You do not have permission to rename this transcript',
        error: 'Forbidden',
      },
    },
  })
  async rename(
    @Param('id', ParseIntPipe) id: number,
    @Body() renameTranscriptDto: RenameTranscriptDto,
    @CurrentUser() user: RequestUser,
  ): Promise<TranscriptResponseDto> {
    return await this.transcriptService.rename(
      id,
      user.userId,
      renameTranscriptDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a transcript',
    description:
      'Soft deletes a transcript (marks it as deleted). Only the transcript owner can delete it.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Transcript ID' })
  @ApiResponse({
    status: 204,
    description: 'Transcript successfully deleted',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Transcript not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Transcript not found',
        error: 'Not Found',
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to delete this transcript',
    schema: {
      example: {
        statusCode: 403,
        message: 'You do not have permission to delete this transcript',
        error: 'Forbidden',
      },
    },
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    return await this.transcriptService.delete(id, user.userId);
  }
}
