import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    try {
        if (!token) {
            return res.status(401).json({ error: "Non autorisé. Veuillez vous connecter." });
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }
    } catch (err) {
        const error = new Error("Token invalide");
        error.statusCode = 403;
        return next(error);
    }
};