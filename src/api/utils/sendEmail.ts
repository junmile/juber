import Mailgun from 'mailgun-js';

const mailGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: process.env.MAILGUN_DOMAIN || ''
});

const sendEmail = (subject: string, html: string) => {
  const emailData = {
    from: 'designeryjun@gmail.com',
    to: 'designeryjun@gmail.com',
    subject,
    html
  };
  return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello! ${fullName}, please verify your email`;
  const emailBody = `Verify your email by clicking <a href="https://hidden-beyond-22858.herokuapp.com/${key}">here</a>`;
  return sendEmail(emailSubject, emailBody);
};
