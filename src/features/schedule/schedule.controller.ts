import { Controller, Get, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleListQuery } from './dto/schedule-list-query.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('/list')
  async getScheduledMessage(
    @Query()
    { status, startDate, endDate, page, pageSize }: ScheduleListQuery,
  ) {
    let parsedStartDate, parsedEndDate;

    if (startDate) {
      parsedStartDate = new Date(startDate);
    }

    if (endDate) {
      parsedEndDate = new Date(endDate);
    }

    const schedules = await this.scheduleService.getWithPagination(
      parsedStartDate,
      parsedEndDate,
      status,
      page,
      pageSize,
    );

    return schedules.map((schedule) => ({
      scheduleId: schedule.id,
      scheduledTime: schedule.runAt,
      message: schedule.message,
    }));
  }
}
