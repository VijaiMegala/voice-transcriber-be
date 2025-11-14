import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { DictionaryResponseDto } from './dto/dictionary-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/strategies/jwt.strategy';

@ApiTags('dictionary')
@ApiBearerAuth('access-token')
@Controller({ path: 'dictionary', version: '1' })
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all dictionary entries',
    description:
      'Retrieves all dictionary entries for the authenticated user, ordered by latest created_at first.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dictionary entries retrieved successfully',
    type: [DictionaryResponseDto],
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
    @CurrentUser() user: RequestUser,
  ): Promise<DictionaryResponseDto[]> {
    return await this.dictionaryService.findAll(user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new dictionary entry',
    description:
      "Creates a new dictionary entry with current word and replacement word for the authenticated user. Validates that neither word already exists in the user's dictionary.",
  })
  @ApiBody({ type: CreateDictionaryDto })
  @ApiResponse({
    status: 201,
    description: 'Dictionary entry successfully created',
    type: DictionaryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'currentWord must be a string',
          'currentWord should not be empty',
          'replacementWord must be a string',
          'replacementWord should not be empty',
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
  @ApiConflictResponse({
    description: 'Conflict - Word already exists in dictionary',
    schema: {
      example: {
        statusCode: 409,
        message:
          'The word "colour" already exists in your dictionary (either as a current word or replacement word)',
        error: 'Conflict',
      },
    },
  })
  async create(
    @Body() createDictionaryDto: CreateDictionaryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<DictionaryResponseDto> {
    return await this.dictionaryService.create(
      user.userId,
      createDictionaryDto,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a dictionary entry',
    description:
      "Updates an existing dictionary entry. Only the entry owner can update it. Validates that updated words do not already exist in the user's dictionary.",
  })
  @ApiParam({ name: 'id', type: Number, description: 'Dictionary entry ID' })
  @ApiBody({ type: UpdateDictionaryDto })
  @ApiResponse({
    status: 200,
    description: 'Dictionary entry successfully updated',
    type: DictionaryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['currentWord must be a string'],
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
    description: 'Dictionary entry not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Dictionary entry not found',
        error: 'Not Found',
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to update this dictionary entry',
    schema: {
      example: {
        statusCode: 403,
        message: 'You do not have permission to update this dictionary entry',
        error: 'Forbidden',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict - Word already exists in dictionary',
    schema: {
      example: {
        statusCode: 409,
        message:
          'The word "colour" already exists in your dictionary (either as a current word or replacement word)',
        error: 'Conflict',
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<DictionaryResponseDto> {
    return await this.dictionaryService.update(
      id,
      user.userId,
      updateDictionaryDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a dictionary entry',
    description:
      'Soft deletes a dictionary entry (marks it as deleted). Only the entry owner can delete it.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Dictionary entry ID' })
  @ApiResponse({
    status: 204,
    description: 'Dictionary entry successfully deleted',
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
    description: 'Dictionary entry not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Dictionary entry not found',
        error: 'Not Found',
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to delete this dictionary entry',
    schema: {
      example: {
        statusCode: 403,
        message: 'You do not have permission to delete this dictionary entry',
        error: 'Forbidden',
      },
    },
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    return await this.dictionaryService.delete(id, user.userId);
  }
}
