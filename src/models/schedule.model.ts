import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Messages } from './messages.model';

@Entity()
export class Schedules {
  @PrimaryColumn('uuid', { default: uuidv4() })
  id: string;

  @Column({ type: 'datetime' })
  runAt: Date;

  @Column({ type: 'text' })
  message: string;

  @OneToMany(() => Messages, (message) => message.schedule, {
    cascade: true,
  })
  @JoinColumn({ name: 'schedule_id' })
  messages: Messages[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
