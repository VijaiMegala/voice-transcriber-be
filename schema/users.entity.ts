import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { Transcript } from './transcript.entity';
import { Dictionary } from './dictionary.entity';

@Entity('users')
@Index('idx_users_username', ['username'])
@Index('idx_users_email', ['email'])
@Index('idx_users_created_at', ['createdAt'])
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'username', type: 'varchar', length: 100 })
  username: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'token', type: 'text', nullable: true })
  token: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Transcript, (transcript) => transcript.user)
  transcripts: Transcript[];

  @OneToMany(() => Dictionary, (dictionary) => dictionary.user)
  dictionaries: Dictionary[];
}
  