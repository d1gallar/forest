import express from "express";
import * as addressCtrl from "../controllers/address.controller";
import { userAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", addressCtrl.getAddresses);  // TODO: only authorized by admin
router.post("/", addressCtrl.createAddress);
router.patch("/userDefault", userAuth, addressCtrl.updateDefaultAddress);
router.get("/:id", userAuth, addressCtrl.getAddressById);
router.delete("/:id", userAuth, addressCtrl.deleteAddress);
router.put("/:id", userAuth, addressCtrl.updateAddress);
router.patch("/:id", userAuth, addressCtrl.updateAddressPartial);

export default router;
