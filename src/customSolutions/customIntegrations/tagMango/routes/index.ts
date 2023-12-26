import serviceModel from "@/models/mongoDB/service.model";
import { Router } from "express";
import { getAllActiveMangoes, getOtp, verifyOtp } from "../apiWrapper";
import { getCredential } from "../models/tmCredential.model";
import { createMapper } from "../models/tmMapper.model";
const router = Router();

// Get OTP
router.post("/getOtp", async (req, res) => {
    try {
        const { phone } = req.body;
        const data = {
            phone,
            userAgent: req.headers["user-agent"] || "",
        };
        const result = await getOtp(data);
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
