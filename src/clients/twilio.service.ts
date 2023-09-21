import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private readonly twilioClient: Twilio;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.twilioClient = new Twilio(
      configService.get('application.twilioSID'),
      configService.get('application.twilioAuthToken'),
    );
  }

  async sendSMS(to: string, body: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body,
        to,
        from: this.configService.get('application.twilioPhoneNumber'),
      });
    } catch (err: Error | unknown) {
      console.error('Error sending SMS: ', err);
      throw err;
    }
  }
}
