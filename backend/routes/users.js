import express from "express";
import {
            getUser,
            getAllUsersConnected
       } 
    from "../controllers/users.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getUser);
router.get("/getAll", verifyToken, getAllUsersConnected);

export default router;