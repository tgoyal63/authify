import { Router } from "express";
import { getOtp, verifyOtp, getAllActiveMangoes } from "../apiWrapper";
import { createMapper } from "../models/tmMapper";
import { getCredential } from "../models/tmCredential.model";
import serviceModel from "@/models/mongoDB/service.model";
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
	}
});

router.get("/mangoes", async (req, res) => {
	try {
		const credential = await getCredential(req.customer.id);
		if (!credential) throw new Error("Credential not found");
		const mangoes = await getAllActiveMangoes(req.customer.id);
		if (!mangoes.result) throw new Error("No mangoes found");

		res.status(200).send({
			message: "Mangoes fetched successfully",
			data: mangoes,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Error in fetching mangoes",
			data: error,
		});
	}
});

// TODO: Add validation for mango
router.post("/addCustomSolution", async (req, res) => {
	try {
		const { mango, serviceId } = req.body;
		const service = await serviceModel.findById(serviceId).exec();
		if (!service) throw new Error("Service not found");
		const mangoes = await getAllActiveMangoes(req.customer.id);
		if (!mangoes.result.find((m: any) => m._id === mango))
			throw new Error("Mango not found in TagMango");
		const mapper = await createMapper({
			mango,
			serviceId,
			customerId: req.customer.id,
			tmCredentialId: (await getCredential(req.customer.id))?._id,
			metadata: {},
		});
		res.status(200).send({
			message: "Service created successfully",
			data: mapper,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Error in creating service",
			data: error,
		});
	}
});

export default router;

// Get all active mangoes response
/**
 * {
    "code": 0,
    "result": [
        {
            "_id": "64c3dae85c1d12ea50a30737",
            "isStopTakingPayment": false,
            "isHidden": false,
            "isDeleted": false,
            "content": true,
            "chat": true,
            "videocall": 0,
            "webinar": true,
            "isPublic": false,
            "additionalCoverContent": [],
            "excludegst": false,
            "includegst": true,
            "activeSubscribers": 8657,
            "totalEarning": 13106263.34,
            "playlistArr": [],
            "shortUrl": "58eae3b49c",
            "disableMoe": false,
            "disableReciept": false,
            "landingPagePublished": true,
            "creator": "64ba7f405161b1b6716e0a83",
            "title": "Attack Mode",
            "start": "2023-07-28T15:01:49.674Z",
            "end": "2030-12-31T12:54:14.987Z",
            "price": 1500,
            "currency": "INR",
            "description": "The Most Efficient System to Achieve any Goal You Want. \n",
            "styledDescription": "<p>The Most Efficient System to Achieve any Goal You Want. </p>\n",
            "recurringType": "onetime",
            "whatsapp": "notrequested",
            "imgUrl": "",
            "videoUrl": "",
            "mangoSlug": "attack-mode",
            "maxSubscriber": null,
            "inrAmount": 1500,
            "usdStripeProductPriceId": null,
            "eurStripeProductPriceId": null,
            "customFields": null,
            "otpLess": true,
            "createdAt": "2023-07-28T15:12:40.268Z",
            "updatedAt": "2023-12-13T05:20:27.302Z",
            "__v": 0,
            "eurAmount": null,
            "usdAmount": null,
            "mangoPageId": "64ca925bf4ae0330f86e1f23",
            "mangoPageUploadedLink": "https://app.gangstaphilosophy.com/services/attackmode",
            "trialPeriod": 0
        },
        {
            "_id": "65678b71b9c2df835a65d235",
            "isStopTakingPayment": false,
            "isHidden": true,
            "isDeleted": false,
            "content": true,
            "chat": true,
            "videocall": 0,
            "webinar": true,
            "isPublic": false,
            "additionalCoverContent": [],
            "excludegst": false,
            "includegst": true,
            "activeSubscribers": null,
            "totalEarning": 0,
            "playlistArr": [],
            "shortUrl": "6535cfcff3",
            "disableMoe": false,
            "disableReciept": false,
            "landingPagePublished": false,
            "trialPeriod": 0,
            "additionalMangoes": [],
            "offers": [],
            "emailToCreatorOnEveryPurchase": false,
            "zeroCostMango": false,
            "creator": "64ba7f405161b1b6716e0a83",
            "title": "Nuclear Mode",
            "start": "2023-07-28T15:01:49.674Z",
            "end": "2030-12-31T12:54:14.987Z",
            "price": 400,
            "currency": "INR",
            "description": "4 Simple Techniques to Nuke and Destroy any Goal you want to.\n",
            "styledDescription": "<p>4 Simple Techniques to Nuke and Destroy any Goal you want to.</p>\n",
            "recurringType": "onetime",
            "whatsapp": "notrequested",
            "imgUrl": "",
            "videoUrl": "",
            "mangoSlug": "nuclear-mode",
            "maxSubscriber": null,
            "inrAmount": 400,
            "usdAmount": 4.8,
            "eurAmount": 4.36,
            "usdStripeProductPriceId": null,
            "eurStripeProductPriceId": null,
            "noOfDays": null,
            "customFields": null,
            "otpLess": true,
            "defaultPaymentGateway": null,
            "hideCouponCodeInput": false,
            "repurchaseOneTime": false,
            "createdAt": "2023-11-29T19:05:21.918Z",
            "updatedAt": "2023-12-02T07:29:42.906Z",
            "__v": 0,
            "razorpayPlanId": null
        }
    ],
    "type": "OK",
    "message": "Successfully loaded data"
}
 */
