import Mailgun from 'mailgun-js';

const mailGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: process.env.MAILGUN_DOMAIN || '',
});

const sendEmail = (subject: string, html: string, to: string) => {
  console.log('메일건사용');
  const emailData = {
    from: 'hyolee1003@nate.com',
    to,
    subject,
    html,
  };
  return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (
  fullName: string,
  key: string,
  email: string
) => {
  console.log('이메일 키 : ', key);
  const emailSubject = `안녕하세요! ${fullName}님, Juber인증확인을 위한 메일입니다.`;
  const emailBody = `안녕하세요! ${fullName}님, Juber를 방문해 주셔서 감사합니다.<br> 아래 링크를 누르시면 인증처리 됩니다.<br>Key : ${key}<br><a href="https://hidden-beyond-22858.herokuapp.com/${key}">Juber 메일 인증 확인</a>`;
  return sendEmail(emailSubject, emailBody, email);
};
