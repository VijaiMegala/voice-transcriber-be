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

@Entity('dictionary')
@Index('idx_dictionary_user_id', ['user'])
@Index('idx_dictionary_current_word', ['currentWord'])
@Index('idx_dictionary_created_at', ['createdAt'])
export class Dictionary {
  @PrimaryGeneratedColumn({ name: 'word_id' })
  wordId: number;

  @Column({ name: 'current_word', type: 'varchar', length: 255 })
  currentWord: string;

  @Column({ name: 'replacement_word', type: 'varchar', length: 255 })
  replacementWord: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.dictionaries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}

