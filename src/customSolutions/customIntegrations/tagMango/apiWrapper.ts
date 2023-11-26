import axios from "axios";
// import { createMapper } from "./models/tmMapper";
import { createCredential } from "./models/tmCredential.model";

export const getOtp = async (data: { phone: number; userAgent: string }) => {
	const config = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://api-prod-new.tagmango.com/get-otp",
		headers: {
			"x-whitelabel-host": "tagmango.com",
			"Content-Type": "application/json",
		},
		data,
	};
	let response = await axios(config);
	let result = response.data;

	if (result.code === 0 && result.type === "OK") {
		return result;
	} else {
		throw result;
	}
};

export const verifyOtp = async (
	data: {
		phone: number;
		otp: number;
		userAgent: string;
	},
	customerId: string,
) => {
	const config = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://api-prod-new.tagmango.com/verify-otp",
		headers: {
			"x-whitelabel-host": "tagmango.com",
			"Content-Type": "application/json",
		},
		data,
	};
	const response = await axios(config);
	if (response.data.code !== 0) throw new Error(response.data);
	let { result } = await response.data;
	if (!result.accessToken || !result.refreshToken) throw new Error("Error in getting access token");
	const credential = await createCredential({
		customerId,
		accessToken: result.accessToken,
		refreshToken: result.refreshToken,
		phone: data.phone,
	});
	if (!credential.acknowledged) {
		throw new Error("Error in creating credential");
	}
	return true;
};

export const getAccessToken = async (refreshToken: string) => {
	const config = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://api-prod-new.tagmango.com/get-access-token",
		headers: {
			"x-whitelabel-host": "tagmango.com",
			"Content-Type": "application/json",
		},
		data: { refreshToken },
	};
	let response = await axios(config);
	let result = response.data;

	if (result.code === 0 && result.type === "OK") {
		return result;
	} else {
		throw result;
	}
};

export const getSubscribers = async ({
	page = 1,
	type = "all",
	pageSize = 25,
	mangoes,
	term,
	token,
}: {
	page: number;
	type: string;
	term: string;
	mangoes: string;
	pageSize: number;
	token: string;
}) => {
	const config = {
		method: "get",
		maxBodyLength: Infinity,
		url: "https://api-prod-new.tagmango.com/v2/subscribers",
		headers: {
			"x-whitelabel-host": "app.gangstaphilosophy.com",
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`,
		},
		params: { page, type, pageSize, mangoes, term },
	};
	let response = await axios(config);
	let result = response.data;

	if (result.code === 0 && result.type === "OK") {
		return result;
	} else {
		throw result;
	}
};

export const getAllActiveMangoes = async (token: string) => {
	const config = {
		method: "get",
		maxBodyLength: Infinity,
		url: "https://api-prod-new.tagmango.com/get-all-active-mangoes",
		headers: {
			"x-whitelabel-host": "app.gangstaphilosophy.com",
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`,
		},
	};
	let response = await axios(config);
	let result = response.data;

	if (result.code === 0 && result.type === "OK") {
		return result;
	} else {
		throw result;
	}
};
