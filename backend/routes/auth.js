import express from "express";
import { registerUser, loginUser, logoutUser, getMe } from "../controllers/auth.js"
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
const router = express.Router();

router.post("/inscription", upload.single("profileImage"), registerUser);
router.post("/connexion", loginUser);
router.post("/deconnexion", verifyToken, logoutUser);
router.get("/me", getMe);

export default router;