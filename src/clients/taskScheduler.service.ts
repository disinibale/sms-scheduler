import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export default class TaskScheduler {
  private readonly logger = new Logger(TaskScheduler.name);
  private registeredTasks: NodeJS.Timeout[] = [];

  constructor() {}

  registerTask(taskName: string, runAt: Date, taskFunction: () => void): void {
    this.logger.log(`Task ${taskName} created at ${new Date()}`);

    const currTime = new Date().getTime();
    const scheduledTime = runAt.getTime();

    if (scheduledTime <= currTime) {
      this.logger.log(
        'Excuting task immediately (Scheduled time is not in the present/present)',
      );
      taskFunction();
    } else {
      const delay = scheduledTime - currTime;
      const timeout = setTimeout(() => {
        this.logger.log(`Task executed at ${runAt}`);
        taskFunction();
        this.removeTask(timeout);
      }, delay);

      this.registeredTasks.push(timeout);
    }
  }

  removeTask(timeout: NodeJS.Timeout): void {
    const index = this.registeredTasks.indexOf(timeout);
    if (index !== -1) {
      clearTimeout(timeout);
      this.registeredTasks.splice(index, 1);
    }
  }
}
