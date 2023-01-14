import {Router} from "express";
import * as AuthCtrl from "../controllers/auth.controller";
import { userAuth } from "../middleware/auth";

const router = Router();

router.post("/login", AuthCtrl.login);
router.post("/register", AuthCtrl.register);
router.post("/logout", AuthCtrl.logout);
router.get("/userId", userAuth, AuthCtrl.getUserId);
router.get("/refresh", AuthCtrl.refresh);

export default router;