import { RequestHandler } from "express";
import { ApiResponse } from "../api";

export type Controller<
    RequestParams = Record<string, never>,
    ResponseBody = void,
    RequestBody = void,
    QueryParams = Record<string, never>,
> = RequestHandler<
    RequestParams,
    ApiResponse<ResponseBody>,
    RequestBody,
    QueryParams
>;
