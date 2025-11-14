import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { Dictionary } from '../../schema/dictionary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dictionary])],
  controllers: [DictionaryController],
  providers: [DictionaryService],
})
export class DictionaryModule {}
