import axios from "axios";
import { createCredential, getCredential } from "./models/tmCredential.model";

export const getOtp = async (
    data: { phone: number; userAgent: string },
    domain: string,
) => {
    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-prod-new.tagmango.com/get-otp",
        headers: {
            "Content-Type": "application/json",
            "x-whitelabel-host": domain,
        },
        data,
    };
    const response = await axios(config);
    const result = response.data;

    if (result.code === 0 && result.type === "OK") {
        return result;
    }
    throw result;
};

export const verifyOtp = async (
    data: {
        phone: number;
        otp: number;
        userAgent: string;
    },
    customerId: string,
    domain: string,
) => {
    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-prod-new.tagmango.com/verify-otp",
        headers: {
            "Content-Type": "application/json",
            "x-whitelabel-host": domain,
            logoutAll: true,
        },
        data,
    };
    const response = await axios(config);
    if (response.data.code !== 0) throw new Error(response.data);
    const { result } = await response.data;
    if (!result.accessToken || !result.refreshToken)
        throw new Error("Error in getting access token");
    const credential = await createCredential({
        customerId,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        phone: data.phone,
        domain,
    });
    if (!credential.acknowledged) {
        throw new Error("Error in creating credential");
    }
    return true;
};

export const getAccessToken = async (customerId: string) => {
    const credential = await getCredential(customerId);
    if (!credential) throw new Error("Credential not found");

    // If token is valid for more than 80 minutes, return it
    // if (credential.updatedAt.getTime() + 80 * 60 * 1000 > Date.now())
    //     return {
    //         accessToken: credential.accessToken,
    //         domain: credential.domain,
    //     };

    const { refreshToken } = credential;
    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-prod-new.tagmango.com/get-access-token",
        headers: {
            "x-whitelabel-host": credential.domain,
            "Content-Type": "application/json",
        },
        data: { refreshToken },
    };
    const response = await axios(config);
    if (response.data.code !== 0) throw new Error(response.data);

    const { result } = response.data;
    if (!result.accessToken || !result.refreshToken)
        throw new Error("Error in getting access token");

    const data = await createCredential({
        customerId,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        phone: credential.phone,
        domain: credential.domain,
    });
    if (!data.acknowledged)
        throw new Error("Error in updating credential with new token");

    return {
        accessToken: result.accessToken as string,
        domain: credential.domain,
    };
};

export const getSubscribers = async ({
    page = 1,
    type = "all",
    pageSize = 25,
    mangoes,
    customerId,
    term,
    startDate,
    endDate,
}: {
    page?: number;
    type: "all" | "active" | "inactive" | "revoked";
    pageSize?: number;
    mangoes: string;
    customerId: string;
    term: string | number;
    startDate?: string;
    endDate?: string;
}) => {
    const credential = await getAccessToken(customerId);
    const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://api-prod-new.tagmango.com/v2/subscribers",
        headers: {
            "x-whitelabel-host": credential.domain,
            "Content-Type": "application/json",
            authorization: `Bearer ${credential.accessToken}`,
            "x-whitelabel-creator": await getHostDetails(customerId),
        },
        params: {
            page,
            type,
            pageSize,
            mangoes,
            term,
            startDate,
            endDate,
            spreadSubscribers: true,
        },
    };
    const response = await axios(config);
    const result = response.data;

    if (result.code === 0 && result.type === "OK") {
        return result.result;
    }
    throw result;
};

export const getAllActiveMangoes = async (customerId: string) => {
    const credential = await getAccessToken(customerId);
    const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://api-prod-new.tagmango.com/get-all-active-mangoes",
        headers: {
            "x-whitelabel-host": credential.domain,
            "x-whitelabel-creator": await getHostDetails(customerId),
            authorization: `Bearer ${credential.accessToken}`,
        },
    };
    const response = await axios(config);
    const result = response.data;

    if (result.code === 0 && result.type === "OK") {
        return result.result;
    }
    throw result;
};

export const getHostDetails = async (customerId: string) => {
    const credential = await getAccessToken(customerId);
    const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://api-prod-new.tagmango.com/get-host-details",
        headers: {
            "x-whitelabel-host": credential.domain,
            authorization: `Bearer ${credential.accessToken}`,
        },
    };
    const response = await axios(config);
    const result = response.data;

    if (result.code === 0 && result.type === "OK") {
        return result.result.creator._id;
    }
    throw result;
};
