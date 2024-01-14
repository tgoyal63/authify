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

export const sendEmail = async (to: string, subject: string, body: string) => {
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

    return ses.send(command);
};
