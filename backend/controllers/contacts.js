import client from "../database.js";

export const getContacts = async (req, res) => {
    const user_id = req.user.id;
    try {
        const query = `
            SELECT name, phone, email, designation, created_at, group_name, id
            FROM contacts
            WHERE user_id = $1
            ORDER BY group_name ASC
        `
        const {rows} = await client.query(query, [user_id]);
        res.status(200).json({
            success: true,
            message: "Get All contacts",
            allcontacts: rows
        });
    } catch(err) {
        next(err);
    }
}

export const newContact = async (req, res, next) => {
    try {
        const {name, email, phone, designation, group_name} = req.body;
        const user_id = req.user.id;

        if (!user_id) {
            return res.status(401).json({ error: "Non autorisé. Veuillez vous connecter." });
        }
        if(!name || !email || !phone || !designation || !group_name) {
            const error = new Error("All fields are required");
            error.statusCode = 400;
            return next(error);
        }
        const query = `
            INSERT INTO contacts (name, phone, email, designation, group_name, user_id) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [
            name, phone, email, designation, group_name, user_id
        ]
        const {rows} = await client.query(query, values);
        res.status(201).json({
            message: "Create new contact",
            success: true,
            result: rows[0],
        });
    } catch(err) {
        next(err);
    }
}

export const getContact = async (req, res, next) => {
    try {
        const contactId = req.params.id;
        if (!contactId) {
            const error = new Error("Contact not found");
            error.statusCode = 400;
            return next(error); 
        }
        const query = `
            SELECT *
            FROM contacts
            WHERE id = $1
        `
        const {rows} = await client.query(query, [contactId]);
        res.status(200).json({
            message: "Get contact",
            success: true,
            result: rows[0],
        })
    } catch(err) {
        next(err);
    }
}

export const updateContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const { name, email, phone, designation, group_name } = req.body;
        if (!contactId) {
            const error = new Error("Contact not found");
            error.statusCode = 400;
            return next(error); 
        }

        const query = `
            UPDATE contacts
            SET name = $1, phone = $2, email = $3, designation = $4, group_name = $5
            WHERE id = $5
            RETURNING *
        `
        const {rows} = await client.query(query, [name, phone, email, designation, group_name, contactId]);
        res.status(200).json({
            message: "Update contact",
            success: true,
            result: rows[0],
        })
    } catch(err) {
        next(err);
    }
}

export const deleteContact = async (req, res, next) => {
    try {
        const contactId = req.params.id;
        if (!contactId) {
            const error = new Error("Contact not found");
            error.statusCode = 400;
            return next(error); 
        }
        const query = `
            DELETE FROM contacts
            WHERE id = $1
            RETURNING *
        `
        const {rows} = await client.query(query, [contactId]);
        res.status(200).json({
            message: "Delete contact",
            success: true,
            result: rows[0],
        })
    } catch(err) {
        next(err);
    }
}
