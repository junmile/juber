import Twilio from 'twilio';

const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const sendSMS = (to: string, body: string) => {
  return twilioClient.messages.create({
    body,
    to,
    from: process.env.TWILIO_PHONE,
  });
};

export const sendVerificationSMS = (to: string, key: string) => {
  console.log(key);
  sendSMS(to, `Juber 인증번호 : ${key} 를 입력해 주세요`);
};
