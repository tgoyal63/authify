import { Router } from "express";
import { getOtp, verifyOtp } from "../apiWrapper";
const router = Router();

// Get OTP
router.post("/getOtp", async (req, res) => {
	try {
		const { phone } = req.body;
		const data = {
			phone,
			userAgent: req.headers["user-agent"] || "",
		};
		let result = await getOtp(data);
		if (result.code === 0 && result.type === "OK") {
			res.status(200).send({
				message: "OTP sent successfully",
				data: result,
			});
		} else {
			res.status(500).send({
				message: "Error in sending OTP",
				error: result,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Error in sending OTP",
			error,
		});
	}
});

// Verify OTP
router.post("/verifyOtp", async (req, res) => {
	try {
		const { phone, otp } = req.body;
		const data = {
			phone,
			otp,
			userAgent: req.headers["user-agent"] || "",
		};
		const verified = await verifyOtp(data, req.customer.id);
		if (verified) {
			res.status(200).send({
				message: "OTP verified successfully",
			});
		} else {
			res.status(500).send({
				message: "Error in verifying OTP",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Error in verifying OTP",
			data: error,
		});
	} // Ask about Response -> return verified or list of mangoes
});

export default router;
