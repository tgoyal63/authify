import { Router } from "express";

export interface Config {
	isEmailVerificationEnabled: boolean;
	isPhoneVerificationEnabled: boolean;
	isDiscordOauthEnabled: boolean;
}

export interface CustomSolution {
	id: string;
	router: Router;
	config: Config;
	subscriberValidator: (term: string | number) => boolean;
}
