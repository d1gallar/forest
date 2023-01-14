import express from "express";
import * as userCtrl from '../controllers/users.controller';
import { userAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", userCtrl.getUsers); // TODO: only authorized by admin
router.post("/", userCtrl.createUser);
router.get("/:id", userAuth, userCtrl.getUserById);
router.delete("/:id", userAuth,userCtrl.deleteUser);
router.put("/:id", userAuth, userCtrl.updateUser);
router.patch("/:id", userAuth, userCtrl.updateUserPartial);

export default router;