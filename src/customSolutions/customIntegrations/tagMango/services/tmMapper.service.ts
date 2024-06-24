import tmMapperModel from "../models/tmMapper.model";

export const createMapper = async ({
  mango,
  serviceId,
  tmCredentialId,
  customerId,
  metadata,
  customIntegrationId,
}: {
  mango: string;
  serviceId: string;
  tmCredentialId: string;
  customerId: string;
  metadata: object;
  customIntegrationId: string;
}) => {
  return tmMapperModel
    .findOneAndUpdate(
      { service: serviceId },
      {
        mango,
        tmCredential: tmCredentialId,
        customer: customerId,
        metadata,
        customIntegrationId,
      },
      { upsert: true, new: true }
    )
    .exec();
};

export const getMapper = async (
  {
    mango,
    serviceId,
    customerId,
  }: {
    mango?: string;
    serviceId?: string;
    customerId?: string;
  },
  populated = false
) => {
  return tmMapperModel
    .findOne({
      ...(mango && { mango }),
      ...(serviceId && { service: serviceId }),
      ...(customerId && { customer: customerId }),
    })
    .populate(populated ? ["service", "tmCredential", "customer"] : [])
    .lean()
    .exec();
};
