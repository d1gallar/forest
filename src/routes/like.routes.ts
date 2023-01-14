import express from "express";
import * as likeCtrl from "../controllers/like.controller";
import { userAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", likeCtrl.getLikes); // TODO: only authorized by admin
router.get("/user/:userId", userAuth, likeCtrl.getUserLikes);
router.get("/userProducts", userAuth, likeCtrl.getUserLikedProducts);
router.post("/", likeCtrl.createLike);
router.get("/:id", userAuth, likeCtrl.getLikeById);
router.delete("/", userAuth, likeCtrl.deleteLike);
router.put("/:id", userAuth, likeCtrl.updateLike);

export default router;
