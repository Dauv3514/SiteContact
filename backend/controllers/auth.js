import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../database.js"

export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const query= `
        INSERT INTO users (username, email, password) 
        VALUES ($1, $2, $3) 
        RETURNING *
    `;
    const values = [username, email, hashedPassword];

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
        return res.status(200).json({
            success: true, 
            message: "Inscription réussie",
            user: rows[0]
        })
    } catch(err) {
        next(err);
    }
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: '/'
};

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
                email: user.email
            }
        });
    }
    catch(err) {
        next(err);
    }
}

export const logoutUser = (req, res) => {
    res.clearCookie('access_token', cookieOptions)
    .status(200).json({
        success: true,
        message: "Déconnexion réussie"
    })
}

export const getMe = (req, res) => {
    const token = req.cookies.access_token;
    console.log("Cookies reçus:", req.cookies);  
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