import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../database.js"

export const getUser = async (req, res, next) => {
    const user_id = req.user.id;
    try {
        const query = `
            SELECT id, profile_image, username
            FROM users
            WHERE id = $1
        `;
        const { rows } = await client.query(query, [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            message: "Récupération de l'utilisateur",
            user: rows[0]
        })

    } catch(err) {
        next(err);
    }
}

export const getAllUsersConnected = async (req, res, next) => {
    const id = req.user.id;
    try {
        const query = `
            SELECT id, profile_image, username, is_online
            FROM users
            WHERE is_online = TRUE AND id != $1
        `;
        const { rows } = await client.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            message: "Récupération des utilisateurs connectés",
            user: rows
        })

    } catch(err) {
        next(err);
    }
}