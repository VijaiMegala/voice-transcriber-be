import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('transcripts')
@Index('idx_transcripts_user_id', ['user'])
@Index('idx_transcripts_name', ['transcriptName'])
@Index('idx_transcripts_created_at', ['createdAt'])
export class Transcript {
  @PrimaryGeneratedColumn({ name: 'transcript_id' })
  transcriptId: number;

  @Column({ name: 'transcript_name', type: 'varchar', length: 255 })
  transcriptName: string;

  @Column({ name: 'transcript', type: 'text', nullable: true })
  transcript: string | null;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.transcripts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}

