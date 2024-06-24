import {
  SESClient,
  SESClientConfig,
  SendEmailCommand,
} from "@aws-sdk/client-ses";

const SES_CONFIG: SESClientConfig = {
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

const ses = new SESClient(SES_CONFIG);

/**
 * Sends an email using AWS SES
 * @param to Recipient email address
 * @param subject Email subject
 * @param body Email body content
 * @returns {Promise<void>}
 */
export const sendEmail = async (to: string, subject: string, body: string) => {
  if (!to || !subject || !body)
    throw new Error("Missing required parameters for sendEmail");
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: process.env.EMAIL_FROM,
  };

  const command = new SendEmailCommand(params);
  try {
    return await ses.send(command);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
