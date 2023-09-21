import { Body, Controller, Param, Post, Get } from '@nestjs/common';

import CreateMessageSchedulingDto from './app.dto';
import TaskScheduler from './clients/taskScheduler.service';

import { ScheduleService } from './features/schedule/schedule.service';
import { MessageService } from './features/message/message.service';
import { AppService } from './app.service';
import { mapGetResponse, mapPostResponse } from './utils/responseMapper';

@Controller()
export class ApplicationController {
  constructor(
    private readonly appService: AppService,
    private readonly taskSchedulerService: TaskScheduler,
    private readonly scheduleService: ScheduleService,
    private readonly messageService: MessageService,
  ) {}

  @Post('/aw')
  createLog() {
    return this.messageService.createLog();
  }

  @Post('/')
  async createMessageScheduling(
    @Body() body: CreateMessageSchedulingDto,
  ): Promise<object | object[]> {
    const schedules = await this.appService.createMessageScheduling(body);
    const mappedSchedules = mapPostResponse(schedules);

    return mappedSchedules.length === 1 ? mappedSchedules[0] : mappedSchedules;
  }

  @Get('/:messageId')
  async getMessage(@Param('messageId') messageId: string) {
    if (!messageId) {
      return { message: 'messageId param missing' };
    }

    const message = await this.messageService.getById(messageId);
    const mappedMessage = mapGetResponse(message);

    return mappedMessage[0];
  }
}
