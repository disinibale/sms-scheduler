import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  UseInterceptors,
  Query,
} from '@nestjs/common';

import CreateMessageSchedulingDto from './app.dto';
import { EStatus } from './utils/enums';
import { AppService } from './app.service';
import { MessageService } from './features/message/message.service';
import { mapGetResponse, mapPostResponse } from './utils/responseMapper';

@Controller()
@UseInterceptors(CacheInterceptor)
export class ApplicationController {
  constructor(
    private readonly appService: AppService,
    private readonly messageService: MessageService,
  ) {}

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

  @Get('/schedule/:scheduleId/sms')
  async getScheduleMessage(
    @Param('scheduleId') scheduleId: string,
    @Query('status') status?: EStatus,
  ) {
    if (!scheduleId) {
      return {
        message: 'scheduleId params is missing',
      };
    }

    const messages = await this.appService.getScheduleMessages(
      scheduleId,
      status,
    );

    return messages.map((message) => ({
      scheduleId: message.schedule.id,
      message: message.schedule.message,
      status: message.status,
    }));
  }
}
