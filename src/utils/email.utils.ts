import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  EMAIL_FROM,
} from "@/config";
import {
  SESClient,
  SESClientConfig,
  SendEmailCommand,
  SendEmailCommandOutput,
} from "@aws-sdk/client-ses";

const SES_CONFIG: SESClientConfig = {
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
};

const ses = new SESClient(SES_CONFIG);

/**
 * Sends an email using AWS SES
 * @param to Recipient email address
 * @param subject Email subject
 * @param body Email body content
 * @returns {Promise<SendEmailCommandOutput>}
 * @throws {Error} If any required parameter is missing or email fails to send
 */
export const sendEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<SendEmailCommandOutput> => {
  if (!to)
    throw new Error("Recipient email address is required for sendEmail.");
  if (!subject) throw new Error("Email subject is required for sendEmail.");
  if (!body) throw new Error("Email body content is required for sendEmail.");

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
    Source: EMAIL_FROM,
  };

  const command = new SendEmailCommand(params);
  try {
    return await ses.send(command);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
