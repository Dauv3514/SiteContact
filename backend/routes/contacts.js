import express from "express";
import {
            getContacts,
            newContact,
            getContact, 
            updateContact, 
            deleteContact
        } 
    from "../controllers/contacts.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getContacts);
router.post("/", verifyToken, newContact);
router.put("/:id", updateContact);
router.get("/:id", getContact);
router.delete("/:id", deleteContact);

export default router;