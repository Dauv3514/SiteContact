import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../database.js"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: '/'
};

export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    const profileImage = req.file ? req.file.filename : null;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const query= `
        INSERT INTO users (username, email, password, profile_image, is_online) 
        VALUES ($1, $2, $3, $4, TRUE)
        RETURNING *
    `;
    const values = [username, email, hashedPassword, profileImage];

    try {
        const usernameQuery = `SELECT * FROM users WHERE username = $1`;
        const { rows: existingUsername } = await client.query(usernameQuery, [username]);

        if (existingUsername.length > 0) {
            const error = new Error("Le nom d'utilisateur est déjà pris");
            error.statusCode = 400;
            return next(error);
        }

        const emailQuery = `SELECT * FROM users WHERE email = $1`;
        const { rows: existingEmail } = await client.query(emailQuery, [email]);

        if (existingEmail.length > 0) {
            const error = new Error("L'email est déjà utilisé");
            error.statusCode = 400;
            return next(error);
        }

        const {rows} = await client.query(query, values);
        const user = rows[0];
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
        );

        res.cookie('access_token', token, cookieOptions)
        .status(200).json({
            success: true,
            message: "Inscription réussie",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profile_image: user.profile_image,
                isOnline: user.is_online
            }
        });
        
    } catch(err) {
        console.error("Erreur lors de l'inscription :", err);
        next(err);
    }
}

export const loginUser = async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const query = `
            SELECT * FROM users WHERE username = $1
        `
        const {rows} = await client.query(query, [username]);

        // Vérifie si l'utilisateur existe
        if (rows.length === 0) {
            const error = new Error("Utilisateur non trouvé");
            error.statusCode = 404;
            return next(error);
        }

        // Vérification du mot de passe
        const user = rows[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Mot de passe incorrect");
            error.statusCode = 401;
            return next(error);
        }

        const updateOnlineStatusQuery = `UPDATE users SET is_online = TRUE WHERE id = $1`;
        await client.query(updateOnlineStatusQuery, [user.id]);

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
        );

        res.cookie('access_token', token, cookieOptions)
        .status(200).json({
            success: true,
            message: "Connexion réussie",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isOnline: user.is_online
            }
        });
    }
    catch(err) {
        next(err);
    }
}

export const logoutUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const updateOnlineStatusQuery = `UPDATE users SET is_online = FALSE WHERE id = $1`;
        await client.query(updateOnlineStatusQuery, [userId]);

        res.clearCookie('access_token', cookieOptions)
        .status(200).json({
            success: true,
            message: "Déconnexion réussie",
            isOnline: updateOnlineStatusQuery.isOnline
        })

    } catch(err) {
        res.status(403).json({ message: "Token invalide" });
    }
}

export const getMe = (req, res) => {
    const token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json({message: "Non authentifié"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json(
            {
                user: decoded,
                message: "Token valide"
            }
        );
    } catch(err) {
        res.status(403).json({message: "Token invalide"});
    }
}