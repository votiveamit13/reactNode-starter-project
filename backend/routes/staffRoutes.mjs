// const express = require("express");
import express from "express";
import * as staffController from "../controllers/staffController.mjs";
const router = express.Router();
// const staffController = require("../controllers/staffController");


//  Login
router.post("/login", staffController.login);

//  Bid
router.post("/add-bid", staffController.addBid);
router.post("/update-response", staffController.updateResponse);

//  NEW Bid List 
router.get("/bids/:staff_id", staffController.getBids);

// module.exports = router;
export default router;