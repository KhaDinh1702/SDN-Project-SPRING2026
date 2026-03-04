import SibApiV3Sdk from 'sib-api-v3-sdk';
import 'dotenv/config';

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: { email: 'nmchau263@gmail.com' }, // phải verify trong Brevo
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error(error.response?.body || error.message);
  }
};
