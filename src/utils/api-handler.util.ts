import { ControllerError, ServiceError } from "@/types/error";
import { Controller } from "@/types/express";
const DiscordOAuth2 = import("discord-oauth2");

export const ApiHandler =
    <
        RequestParams = Record<string, never>,
        ResponseBody = void,
        RequestBody = void,
        QueryParams = Record<string, never>,
    >(
        controllerFunc: Controller<
            RequestParams,
            ResponseBody,
            RequestBody,
            QueryParams
        >,
    ): Controller<RequestParams, ResponseBody, RequestBody, QueryParams> =>
    async (req, res, next) => {
        const { DiscordHTTPError, DiscordRESTError } = await DiscordOAuth2;

        try {
            return controllerFunc(req, res, next);
        } catch (error) {
            if (error instanceof DiscordHTTPError) {
                return res.status(error.code).json({
                    success: false,
                    code: error.code,
                    error: error.response.message,
                });
            }

            if (error instanceof DiscordRESTError) {
                return res.status(error.code).json({
                    success: false,
                    code: error.code,
                    error: error.response.message,
                });
            }

            if (error instanceof ControllerError) {
                return res.status(error.code).json({
                    success: false,
                    code: error.code,
                    error: error.message,
                });
            }

            if (error instanceof ServiceError) {
                return res.status(error.code).json({
                    success: false,
                    code: error.code,
                    error: error.message,
                });
            }

            if (error instanceof Error) {
                return res.status(400).json({
                    success: false,
                    code: 400,
                    error: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                error: "Internal Server Error!!",
                code: 500,
            });
        }
    };
