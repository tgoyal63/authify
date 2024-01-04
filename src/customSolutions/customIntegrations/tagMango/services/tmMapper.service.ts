import tmMapper from "../models/tmMapper.model";

export const getMangoDetails = async (mango: string) => {
    const mapper = await tmMapper.findOne({ mango }).exec();
    return mapper;
};
