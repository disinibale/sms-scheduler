interface IApplicationConfigs {
  application: {
    port: number;
    twilioAuthToken?: string;
    twilioSID?: string;
    twilioPhoneNumber?: string;
  };
}

export default (): IApplicationConfigs => ({
  application: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioSID: process.env.TWILIO_SID,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
});
