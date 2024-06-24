import { z } from "zod";

export const sendOtpValidator = {
  body: z.object({
    phone: z.coerce
      .number()
      .int()
      .min(1000000000, {
        message: "Phone number must be at least 10 digits long.",
      })
      .max(9999999999, {
        message: "Phone number must be at most 10 digits long.",
      }),
  }),
};

export const verifyOtpValidator = {
  body: z.object({
    phone: z.coerce
      .number()
      .int()
      .min(1000000000, {
        message: "Phone number must be at least 10 digits long.",
      })
      .max(9999999999, {
        message: "Phone number must be at most 10 digits long.",
      }),
    otp: z.coerce
      .number()
      .int()
      .min(100000, { message: "OTP must be at least 6 digits long." })
      .max(999999, { message: "OTP must be at most 6 digits long." }),
    otpHash: z.string(),
    expiresAt: z.coerce.number().int(),
  }),
};
