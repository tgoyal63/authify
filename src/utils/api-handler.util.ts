import { Request, Response, NextFunction } from "express";
import { ControllerError, ServiceError } from "@/types/error";
import { Controller } from "@/types/express";
import DiscordOAuth2 from "discord-oauth2";
import { ApiResponse } from "@/types/api";

export const ApiHandler =
  <
    RequestParams extends Record<string, any> = Record<string, never>,
    ResponseBody = void,
    RequestBody = void,
    QueryParams extends Record<string, any> = Record<string, never>
  >(
    controllerFunc: Controller<
      RequestParams,
      ResponseBody,
      RequestBody,
      QueryParams
    >
  ): Controller<RequestParams, ResponseBody, RequestBody, QueryParams> =>
  async (
    req: Request<
      RequestParams,
      ApiResponse<ResponseBody>,
      RequestBody,
      QueryParams
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return await controllerFunc(req, res, next);
    } catch (error) {
      if (error instanceof DiscordOAuth2.DiscordHTTPError) {
        return res.status(error.code).json({
          success: false,
          code: error.code,
          error: error.response.message,
        });
      }

      if (error instanceof DiscordOAuth2.DiscordRESTError) {
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
        error: "Internal Server Error",
        code: 500,
      });
    }
  };
