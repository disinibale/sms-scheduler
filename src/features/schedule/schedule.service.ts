import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Schedules } from 'src/models/schedule.model';
import { EStatus } from 'src/utils/enums';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedules)
    private readonly scheduleRepository: Repository<Schedules>,
  ) {}

  async getWithPagination(
    startDate?: Date,
    endDate?: Date,
    status?: EStatus,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Schedules[]> {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedules')
      .leftJoinAndSelect('schedules.messages', 'recipient');

    if (status) {
      schedules.andWhere('recipient.status = :status', { status });
    }

    if (startDate) {
      schedules.andWhere('schedules.runAt >= :startDate', {
        startDate: startDate.toISOString(),
      });
    }

    if (endDate) {
      schedules.andWhere('schedules.runAt <= :endDate', {
        endDate: endDate.toISOString(),
      });
    }

    schedules.take(pageSize).skip((page - 1) * pageSize);
    schedules.orderBy('schedules.runAt', 'DESC');

    return schedules.getMany();
  }

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
}
