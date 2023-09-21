import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Schedules } from './schedule.model';
import { EStatus } from 'src/utils/enums';

@Entity()
export class Messages {
  @PrimaryColumn('uuid', { default: uuidv4() })
  id: string;

  @ManyToOne(() => Schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedules;

  @Column({ type: 'varchar' })
  phoneNumber: string;

  @Column({ type: 'datetime', nullable: true })
  deliveryTime: Date;

  @Column({
    type: 'enum',
    enum: ['ACCEPTD', 'DELIVRD', 'UNDELIV', 'UNKNOWN'],
    default: EStatus.UNKNOWN,
  })
  status: EStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
