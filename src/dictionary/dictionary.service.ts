import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Dictionary } from '../../schema/dictionary.entity';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { DictionaryResponseDto } from './dto/dictionary-response.dto';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
  ) {}

  /**
   * Check if a word already exists in either currentWord or replacementWord fields
   * for the given user
   */
  private async checkWordExists(
    word: string,
    userId: string,
    excludeWordId?: number,
  ): Promise<boolean> {
    const query = this.dictionaryRepository
      .createQueryBuilder('dictionary')
      .where('dictionary.userId = :userId', { userId })
      .andWhere('dictionary.deletedAt IS NULL')
      .andWhere(
        '(dictionary.currentWord = :word OR dictionary.replacementWord = :word)',
        { word },
      );

    if (excludeWordId) {
      query.andWhere('dictionary.wordId != :excludeWordId', {
        excludeWordId,
      });
    }

    const existing = await query.getOne();
    return !!existing;
  }

  /**
   * Create a new dictionary entry for the authenticated user
   */
  async create(
    userId: string,
    createDictionaryDto: CreateDictionaryDto,
  ): Promise<DictionaryResponseDto> {
    // Check if currentWord already exists in currentWord or replacementWord
    const currentWordExists = await this.checkWordExists(
      createDictionaryDto.currentWord,
      userId,
    );
    if (currentWordExists) {
      throw new ConflictException(
        `The word "${createDictionaryDto.currentWord}" already exists in your dictionary (either as a current word or replacement word)`,
      );
    }

    // Check if replacementWord already exists in currentWord or replacementWord
    const replacementWordExists = await this.checkWordExists(
      createDictionaryDto.replacementWord,
      userId,
    );
    if (replacementWordExists) {
      throw new ConflictException(
        `The word "${createDictionaryDto.replacementWord}" already exists in your dictionary (either as a current word or replacement word)`,
      );
    }

    const dictionary = this.dictionaryRepository.create({
      currentWord: createDictionaryDto.currentWord,
      replacementWord: createDictionaryDto.replacementWord,
      userId,
    });

    const savedDictionary = await this.dictionaryRepository.save(dictionary);

    return {
      wordId: savedDictionary.wordId,
      currentWord: savedDictionary.currentWord,
      replacementWord: savedDictionary.replacementWord,
      userId: savedDictionary.userId,
      createdAt: savedDictionary.createdAt,
      updatedAt: savedDictionary.updatedAt,
    };
  }

  /**
   * Update an existing dictionary entry (only if owned by the user)
   */
  async update(
    wordId: number,
    userId: string,
    updateDictionaryDto: UpdateDictionaryDto,
  ): Promise<DictionaryResponseDto> {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { wordId, deletedAt: IsNull() },
    });

    if (!dictionary) {
      throw new NotFoundException('Dictionary entry not found');
    }

    if (dictionary.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this dictionary entry',
      );
    }

    // Check if currentWord is being updated and already exists
    if (updateDictionaryDto.currentWord !== undefined) {
      const currentWordExists = await this.checkWordExists(
        updateDictionaryDto.currentWord,
        userId,
        wordId,
      );
      if (currentWordExists) {
        throw new ConflictException(
          `The word "${updateDictionaryDto.currentWord}" already exists in your dictionary (either as a current word or replacement word)`,
        );
      }
      dictionary.currentWord = updateDictionaryDto.currentWord;
    }

    // Check if replacementWord is being updated and already exists
    if (updateDictionaryDto.replacementWord !== undefined) {
      const replacementWordExists = await this.checkWordExists(
        updateDictionaryDto.replacementWord,
        userId,
        wordId,
      );
      if (replacementWordExists) {
        throw new ConflictException(
          `The word "${updateDictionaryDto.replacementWord}" already exists in your dictionary (either as a current word or replacement word)`,
        );
      }
      dictionary.replacementWord = updateDictionaryDto.replacementWord;
    }

    const updatedDictionary = await this.dictionaryRepository.save(dictionary);

    return {
      wordId: updatedDictionary.wordId,
      currentWord: updatedDictionary.currentWord,
      replacementWord: updatedDictionary.replacementWord,
      userId: updatedDictionary.userId,
      createdAt: updatedDictionary.createdAt,
      updatedAt: updatedDictionary.updatedAt,
    };
  }

  /**
   * Soft delete a dictionary entry (only if owned by the user)
   */
  async delete(wordId: number, userId: string): Promise<void> {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { wordId, deletedAt: IsNull() },
    });

    if (!dictionary) {
      throw new NotFoundException('Dictionary entry not found');
    }

    if (dictionary.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this dictionary entry',
      );
    }

    await this.dictionaryRepository.softDelete(wordId);
  }

  /**
   * Get all dictionary entries for the authenticated user
   * Ordered by latest created_at first
   */
  async findAll(userId: string): Promise<DictionaryResponseDto[]> {
    const dictionaries = await this.dictionaryRepository.find({
      where: {
        userId,
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return dictionaries.map((d) => ({
      wordId: d.wordId,
      currentWord: d.currentWord,
      replacementWord: d.replacementWord,
      userId: d.userId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));
  }
}
