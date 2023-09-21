import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import CreateMessageSchedulingDto from './app.dto';

import { EStatus } from './utils/enums';
import { Messages } from './models/messages.model';
import { MessageService } from './features/message/message.service';
import { ScheduleService } from './features/schedule/schedule.service';
import TaskScheduler from './clients/taskScheduler.service';
import { TwilioService } from './clients/twilio.service';

@Injectable()
export class AppService {
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
          status: EStatus.UNKNOWN,
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

  sendScheduledMessage(
    messages: Messages[],
    bodyMessage: string,
  ): Promise<void> {
    try {
      for (const message of messages) {
        const scheduledTime = new Date(message.deliveryTime);
        this.taskSchedulerService.registerTask(
          'SMS Scheduling',
          scheduledTime,
          async () => {
            try {
              await this.twilioProviderService.sendSMS(
                message.phoneNumber,
                bodyMessage,
              );
              console.log(
                `Message successfully sent to ${
                  message.phoneNumber
                } at ${new Date()}`,
              );
            } catch (err) {
              throw err;
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
