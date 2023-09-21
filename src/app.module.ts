import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import TaskScheduler from './clients/taskScheduler.service';
import applicationConfig from './configs/application.config';

import { TypeOrmService } from './database/typeorm.service';
import { ApplicationController } from './app.controller';
import { TransactionFactory } from './database/transaction.factory';
import { MessageModule } from './features/message/message.module';
import { ScheduleModule } from './features/schedule/schedule.module';
import { AppService } from './app.service';
import { TwilioService } from './clients/twilio.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
    MessageModule,
    ScheduleModule,
  ],
  controllers: [ApplicationController],
  providers: [TaskScheduler, TwilioService, TransactionFactory, AppService],
})
export class AppModule {}
