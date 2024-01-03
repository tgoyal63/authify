import { Request, Response } from "express";
import { TypedRequestBody } from "zod-express-middleware";
import {
    sendOtpValidator,
    verifyOtpValidator,
} from "@/inputValidators/auth.validators";
import { generateOtp, generateOtpHash, sendOtp } from "@/utils/otp.utils";
import {
    createCustomer,
    getCustomerByDiscordId,
    renewCredentials,
    updatePhone,
} from "@/services/customer.service";
import { signJWT } from "@/utils/jwt.utils";
import {
    generateOauthUrl,
    getDiscordUser,
    getTokens,
} from "@/utils/oauth.utils";
import { FRONTEND_CLIENT_URL, OTP_EXPIRY_TIME } from "@/config";
import { ApiHandler } from "@/utils/api-handler.util";

export const callbackController = ApiHandler(async (req, res) => {
    const state = req.query.state as string;
    const code = req.query.code as string;
    if (state === "bot")
        return res.redirect(
            `${FRONTEND_CLIENT_URL}/messages/success-message-bot`,
        );
    if (!code) throw new Error("Authentication Failed");
    const token = await getTokens(code);
    const user = await getDiscordUser(token.access_token);
    const customer = await getCustomerByDiscordId(user.id);
    if (!customer) {
        if (!user.verified || !user.email) throw new Error("EmailNotVerified");
        const createdCustomer = await createCustomer(
            user.id,
            user.username,
            user.email as string,
            token.refresh_token,
            token.access_token,
            token.expires_in,
            token.scope,
        );
        const jwt = signJWT(
            {
                id: createdCustomer._id,
                discordId: user.id,
                accessToken: token.access_token,
                email: user.email as string,
            },
            `${token.expires_in}s`,
        );

        const params = new URLSearchParams({
            token: jwt,
            phone: "",
            type: "signup",
        });

        return res.redirect(
            `${FRONTEND_CLIENT_URL}/auth/callback-url?${params.toString()}`,
        );
    }
    await renewCredentials(
        user.id,
        token.refresh_token,
        token.access_token,
        token.expires_in,
        token.scope,
    );
    const jwt = signJWT(
        {
            id: customer._id,
            discordId: user.id,
            accessToken: token.access_token,
            phone: String(customer.phone),
            email: customer.email,
        },
        "14d", // 14 days
    );
    // console.log(jwt)
    const params = new URLSearchParams({
        token: jwt,
        phone: "",
        type: "signup",
    });
    return res.redirect(
        `${FRONTEND_CLIENT_URL}/auth/callback-url?${params.toString()}`,
    );
});

export const loginController = ApiHandler(async (req, res) => {
    const oauthLink = generateOauthUrl("state");
    res.redirect(oauthLink);
});

export const sendOtpController = ApiHandler(async (
    req: TypedRequestBody<typeof sendOtpValidator.body>,
    res: Response,
) => {
        const otp = generateOtp();
        const expiresAt = Date.now() + OTP_EXPIRY_TIME;
        const otpHash = generateOtpHash(req.body.phone, otp, expiresAt);
        await sendOtp(req.body.phone, otp);
        res.send({
            data: {
                phone: req.body.phone,
                expiresAt,
                otpHash,
            },
            message: "OTP sent successfully",
            success: true,
        });
    });

export const verifyOtpController = ApiHandler(async (
    req: TypedRequestBody<typeof verifyOtpValidator.body>,
    res: Response,
) => {
        const otpHash = generateOtpHash(
            req.body.phone,
            req.body.otp,
            req.body.expiresAt,
        );
        if (otpHash !== req.body.otpHash) throw new Error("Invalid OTP");
        await updatePhone(req.customer.id, req.body.phone);
        const newJWT = signJWT(
            {
                id: req.customer.id,
                discordId: req.customer.discordId,
                accessToken: req.customer.accessToken,
                phone: String(req.body.phone),
                email: req.customer.email,
            },
            "14d",
        );

        res.send({
            message: "OTP verified successfully",
            success: true,
            data: { token: newJWT },
        });
});

export const getOauthController = ApiHandler(
    async (req: Request, res: Response) => {
        const oauthLink = generateOauthUrl("state");
        res.send({
            data: { oauthLink },
            success: true,
            message: "Oauth link generated successfully",
        });
    },
);
