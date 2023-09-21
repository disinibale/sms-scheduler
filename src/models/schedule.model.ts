import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Schedules {
  @PrimaryColumn('uuid', { default: uuidv4() })
  id: string;

  @Column({ type: 'datetime' })
  runAt: Date;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
