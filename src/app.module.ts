import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { dbConfig } from '../db/dbConfig';
import { TranscriptModule } from './transcript/transcript.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    TranscriptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
