import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", authMiddleware, roleMiddleware(["admin"]), productController.createProduct);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), productController.updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), productController.deleteProduct);
router.post(
    "/:id/images",
    authMiddleware,
    roleMiddleware(["admin"]),
    upload.single("image"),
    productController.addProductImage
);
router.put(
  "/:id/images/:imageId",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.single("image"),
  productController.updateProductImage
);

export default router;