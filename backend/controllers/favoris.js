import client from "../database.js";

export const getFavoris = async (req, res, next) => {
    const user_id = req.user.id;
    try {
        const query = `
            SELECT *
            FROM contacts
            WHERE user_id = $1 and favoris = true
            ORDER BY group_name ASC
        `
        const {rows} = await client.query(query, [user_id]);
        res.status(200).json({
            success: true,
            message: "Get All favoris",
            allcontacts: rows
        });
    } catch(err) {
        next(err);
    }
}

export const addToFavoris = async (req, res, next) => {
    const user_id = req.user.id;
    const contactId = req.params.id;;

    if (!contactId) {
        return res.status(400).json({
            success: false,
            message: "ID du contact requis"
        });
    }

    try {
        const checkQuery = `
            SELECT * FROM contacts 
            WHERE user_id = $1 AND id = $2
        `;
        const { rows: checkRows } = await client.query(checkQuery, [user_id, contactId]);

        if (checkRows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Vous n'êtes pas autorisé à modifier ce contact"
            });
        }

        const query = `
            UPDATE contacts
            SET favoris = NOT favoris
            WHERE user_id = $1 AND id = $2
            RETURNING *
        `
        const {rows} = await client.query(query, [user_id, contactId]);
        res.status(200).json({
            success: true,
            message: "Favoris mis à jour",
            favoris: rows[0]
        })
    } catch(err) {
        next(err);
    }
}