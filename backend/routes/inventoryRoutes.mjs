import express from "express";

import {
  getInventories,
  addInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController.mjs";

const router = express.Router();

router.get("/", getInventories);

router.post("/", addInventory);

router.put("/:id", updateInventory);

router.delete("/:id", deleteInventory);

export default router;