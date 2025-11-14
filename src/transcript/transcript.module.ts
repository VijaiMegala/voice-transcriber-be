import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranscriptController } from './transcript.controller';
import { TranscriptService } from './transcript.service';
import { Transcript } from '../../schema/transcript.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transcript])],
  controllers: [TranscriptController],
  providers: [TranscriptService],
})
export class TranscriptModule {}
