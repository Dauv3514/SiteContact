import express from "express";
import {
            getContacts,
            newContact,
            getContact, 
            updateContact, 
            deleteContact,
            exportContacts
        } 
    from "../controllers/contacts.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getContacts);
router.post("/", verifyToken, newContact);
router.get('/export-csv', verifyToken, exportContacts);
router.get("/:id", getContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;