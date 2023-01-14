import express from "express";
import * as productCtrl from '../controllers/products.controller';

const router = express.Router(); 

router.get("/", productCtrl.getProducts);
router.get("/popular", productCtrl.getPopularProducts);
router.get("/:id", productCtrl.getProductByProductId);
router.post("/", productCtrl.createProduct);
router.delete("/:id", productCtrl.deleteProduct);
router.put("/:id",productCtrl.updateProduct);
router.patch("/:id",productCtrl.updateProductPartial);

export default router;