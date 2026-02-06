import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  console.log('MAILTRAP_USER:', process.env.MAILTRAP_USER);
  console.log('MAILTRAP_PASS:', process.env.MAILTRAP_PASS ? 'OK' : 'MISSING');

  await transporter.sendMail({
    from: '"FreshMart Support" <support@freshmart.test>',
    to,
    subject,
    html,
  });
};
