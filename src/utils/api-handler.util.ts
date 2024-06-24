import { ControllerError, ServiceError } from "@/types/error";
import { Controller } from "@/types/express";
import DiscordOAuth2 from "discord-oauth2";

export const ApiHandler =
  <
    RequestParams = Record<string, never>,
    ResponseBody = void,
    RequestBody = void,
    QueryParams = Record<string, never>
  >(
    controllerFunc: Controller<
      RequestParams,
      ResponseBody,
      RequestBody,
      QueryParams
    >
  ): Controller<RequestParams, ResponseBody, RequestBody, QueryParams> =>
  async (req, res, next) => {
    try {
      return await controllerFunc(req, res, next);
    } catch (error) {
      console.error("Error in API handler:", error);
      const { DiscordHTTPError, DiscordRESTError } = await DiscordOAuth2;

      if (
        error instanceof DiscordHTTPError ||
        error instanceof DiscordRESTError
      ) {
        return res.status(error.code).json({
          success: false,
          code: error.code,
          error: error.response.message,
        });
      }

      if (error instanceof ControllerError || error instanceof ServiceError) {
        return res.status(error.code).json({
          success: false,
          code: error.code,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        code: 500,
      });
    }
  };
