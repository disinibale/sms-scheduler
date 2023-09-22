import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import CreateMessageSchedulingDto from './app.dto';

import TaskScheduler from './clients/taskScheduler.service';
import { EStatus } from './utils/enums';
import { Messages } from './models/messages.model';
import { TwilioService } from './clients/twilio.service';
import { MessageService } from './features/message/message.service';
import { ScheduleService } from './features/schedule/schedule.service';
import { Schedules } from './models/schedule.model';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly taskSchedulerService: TaskScheduler,
    private readonly twilioProviderService: TwilioService,
    private readonly messageService: MessageService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async createMessageScheduling(
    data: CreateMessageSchedulingDto,
  ): Promise<Array<Messages>> {
    const { message, dnis, runAt } = data;
    try {
      const awaitingForSent: Messages[] = [];
      const createdSchedule = await this.scheduleService.save({
        id: uuidV4(),
        runAt,
        message,
      });

      for (let i = 0; i < dnis.length; i++) {
        const createdMessage = await this.messageService.save({
          id: uuidV4(),
          phoneNumber: dnis[i],
          deliveryTime: runAt,
          schedule: createdSchedule,
          status: EStatus.ACCEPTED,
        });
        awaitingForSent.push(createdMessage);
      }

      await this.sendScheduledMessage(awaitingForSent, message);

      return awaitingForSent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getScheduleMessages(id: string, status?: EStatus): Promise<Messages[]> {
    return await this.messageService.getByScheduleId(id, status);
  }

  async getSchedulesWithPagination(
    startDate?: Date,
    endDate?: Date,
    status?: EStatus,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Schedules[]> {
    return await this.scheduleService.getWithPagination(
      startDate,
      endDate,
      status,
      page,
      pageSize,
    );
  }

  sendScheduledMessage(
    messages: Messages[],
    bodyMessage: string,
  ): Promise<void> {
    try {
      for (const message of messages) {
        const scheduledTime = new Date(message.deliveryTime);
        this.taskSchedulerService.registerTask(
          `SMS Scheduling for ${message.phoneNumber}`,
          scheduledTime,
          async () => {
            const startTime = performance.now();
            try {
              await this.twilioProviderService.sendSMS(
                message.phoneNumber,
                bodyMessage,
              );
              await this.messageService.updateStatusById(
                message.id,
                EStatus.DELIVERED,
              );

              this.logger.log(
                `Message successfully sent to ${
                  message.phoneNumber
                } at ${new Date()}`,
              );
            } catch (err) {
              await this.messageService.updateStatusById(
                message.id,
                EStatus.UNDELIVERED,
              );
              this.logger.error(
                `Error sending message to ${message.phoneNumber} | ` + err,
              );
            } finally {
              const endTime = performance.now();
              const executionTime = endTime - startTime;
              this.logger.log(
                `Exec time for message to sent: ${executionTime.toFixed(2)} ms`,
              );
            }
          },
        );
      }

      return;
    } catch (err) {
      throw err;
    }
  }
}
