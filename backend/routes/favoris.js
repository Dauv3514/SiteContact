import express from "express";
import {
            getFavoris,
            addToFavoris
       } 
    from "../controllers/favoris.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getFavoris);
router.patch("/:id", verifyToken, addToFavoris);

export default router;