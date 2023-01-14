import express from "express";
import * as cartCtrl from "../controllers/carts.controller";
import { userAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", cartCtrl.getCarts);  // TODO: add admin auth
router.get("/:userId", userAuth, cartCtrl.getCartByUserId);
router.get("/:userId/populate", userAuth, cartCtrl.getPopulatedCart);
router.post("/", cartCtrl.createCart);
router.delete("/:userId", userAuth, cartCtrl.deleteCart);
router.put("/:userId", userAuth, cartCtrl.updateCart);
router.patch("/clear", userAuth, cartCtrl.clearCart);
router.patch("/:userId/:productId/add", userAuth, cartCtrl.addItemToCart);
router.patch(
  "/:userId/:productId/remove",
  cartCtrl.removeItemFromCart
);
router.patch(
  "/:userId/:productId/quantity",
  cartCtrl.modifyItemQuantity
);

export default router;
