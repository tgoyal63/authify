import tmMapper from "../models/tmMapper.model";

export const getMangoDetailsFromMangoId = async (mango: string) => {
    const mapper = await tmMapper.findOne({ mango }).exec();
    return mapper;
};

export const getMangoDetailsFromServiceId = async (serviceId: string) => {
    const mapper = await tmMapper.findOne({ service: serviceId }).exec();
    return mapper;
};
