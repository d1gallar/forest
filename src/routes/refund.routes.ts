import express from "express";
import * as refundCtrl from "../controllers/refund.controller";
import { userAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", refundCtrl.getRefunds);  // TODO: only authorized by admin
router.post("/", refundCtrl.createRefund);
router.get("/:id", userAuth, refundCtrl.getRefundById);
router.delete("/:id", userAuth, refundCtrl.deleteRefund);
router.put("/:id", userAuth, refundCtrl.updateRefund);
router.patch("/:id", userAuth, refundCtrl.updateRefundPartial);

export default router;
