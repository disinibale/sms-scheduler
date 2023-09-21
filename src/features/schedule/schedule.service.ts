import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Schedules } from 'src/models/schedule.model';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedules)
    private readonly scheduleRepository: Repository<Schedules>,
  ) {}

  async save(data: Partial<Schedules>): Promise<Schedules> {
    return this.scheduleRepository.save(data);
  }

  async updateById(
    id: string,
    data: Partial<Schedules>,
  ): Promise<Schedules | null> {
    const message = this.scheduleRepository.findOne({ where: { id } });
    if (!message) {
      return null;
    }

    return this.scheduleRepository.save(data);
  }

  async saveWithTransaction(
    data: Partial<Schedules>,
    transaction,
  ): Promise<Schedules> {
    if (transaction) return transaction.save(Schedules, data);
    return this.scheduleRepository.save(data);
  }

  async updateByIdWithTransaction(
    id: string,
    data: Partial<Schedules>,
    transaction,
  ): Promise<Schedules | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });

    if (!schedule) {
      return null;
    }

    schedule.message = data.message;
    schedule.runAt = data.runAt;

    if (transaction) {
      return transaction.save(Schedules, schedule);
    }
    return this.scheduleRepository.save(schedule);
  }
}
