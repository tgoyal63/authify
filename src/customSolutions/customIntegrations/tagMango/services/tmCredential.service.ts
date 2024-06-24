import tmCredentialModel from "../models/tmCredential.model";

export const createCredential = async ({
  customerId,
  accessToken,
  refreshToken,
  phone,
  domain,
  serviceId,
}: {
  customerId?: string;
  accessToken: string;
  refreshToken: string;
  phone: number;
  domain: string;
  serviceId: string;
}) => {
  return tmCredentialModel
    .updateOne(
      { service: serviceId },
      { accessToken, refreshToken, phone, domain, customer: customerId },
      { upsert: true }
    )
    .exec();
};

export const getCredential = async (serviceId: string) => {
  return tmCredentialModel.findOne({ service: serviceId }).exec();
};
