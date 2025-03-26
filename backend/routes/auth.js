import express from "express";
import { registerUser, loginUser, logoutUser, getMe } from "../controllers/auth.js"

const router = express.Router();

router.post("/inscription", registerUser);
router.post("/connexion", loginUser);
router.post("/deconnexion", logoutUser);
router.get("/me", getMe);

export default router;