import express from "express";
import {
            getContacts, 
            newContact,
            getContact, 
            updateContact, 
            deleteContact
        } 
    from "../controllers/contacts.js";

const router = express.Router();

router.get("/", getContacts);
router.post("/", newContact);
router.put("/:id", updateContact);
router.get("/:id", getContact);
router.get("/:id", deleteContact);

export default router;