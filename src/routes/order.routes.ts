import express from "express";
import * as orderCtrl from "../controllers/order.controller";
import { userAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", orderCtrl.getOrders);  // TODO: only authorized by admin
router.post("/", orderCtrl.createOrder);
router.get("/:id", userAuth, orderCtrl.getOrderById);
router.delete("/:id", userAuth, orderCtrl.deleteOrder);
router.put("/:id", userAuth, orderCtrl.updateOrder);
router.patch("/:id", userAuth, orderCtrl.updateOrderPartial);

export default router;
