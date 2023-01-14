import express from "express";
import * as stripeCtrl from '../controllers/stripe.controller';
const router = express.Router();

router.get("/config", stripeCtrl.config);
router.post("/create-payment-intent", stripeCtrl.createPaymentIntent); 
router.post("/confirm-payment-intent", stripeCtrl.confirmPaymentIntent); 
router.post("/update-payment-intent", stripeCtrl.updatePaymentIntent);
router.post("/cancel-payment-intent", stripeCtrl.cancelPaymentIntent);
router.post("/retrieve-payment-intent", stripeCtrl.retrievePaymentIntent);
router.post("/retrieve-payment-method", stripeCtrl.retrievePaymentMethod);
router.post("/refund", stripeCtrl.refund);
router.post("/webhook", stripeCtrl.webhook);

export default router;