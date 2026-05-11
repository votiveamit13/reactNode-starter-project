import express from "express";

import upload from "../middleware/uploadProductImage.mjs";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.mjs";

const router = express.Router();

router.get("/", getProducts);

router.post(
  "/add",
  upload.single("image"),
  addProduct
);

router.put(
  "/update/:id",
  upload.single("image"),
  updateProduct
);

router.delete(
  "/delete/:id",
  deleteProduct
);

export default router;