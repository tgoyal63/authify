import customerModel from "../models/mongoDB/customer.model";
import credentialsModel from "../models/mongoDB/credentials.model";

export const createCustomer = async (
	discordId: string,
	username: string,
	email: string,
	refreshToken: string,
	accessToken: string,
	expires_in: number,
	scope: string,
) => {
	const customer = await customerModel.create({ discordId, username, email });
	const credentials = await credentialsModel.create({
		customer: customer._id,
		refreshToken,
		accessToken,
		scope,
		expiresAt: Date.now() + expires_in * 1000,
	});
	customer.discordCredentials = credentials._id;
	await customer.save();
	return customer;
};

export const getCustomerByDiscordId = async (discordId: string) => {
	const customer = await customerModel.findOne({ discordId }).exec();
	return customer;
};

export const renewCredentials = async (
	discordId: string,
	refreshToken: string,
	accessToken: string,
	expires_in: number,
	scope: string,
) => {
	const customer = await getCustomerByDiscordId(discordId);
	if (!customer) throw new Error("CustomerNotFound");
	const credentials = await credentialsModel.findOneAndUpdate(
		{
			customer: customer._id,
		},
		{
			refreshToken,
			accessToken,
			scope,
			expiresAt: Date.now() + expires_in * 1000,
		},
		{
			new: true,
			upsert: true,
		},
	).exec();
	return credentials;
};

export const updatePhone = async (id: string, phone: number) => {
	customerModel.findByIdAndUpdate(id, { phone }).exec();
};
