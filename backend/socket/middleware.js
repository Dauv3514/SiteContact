import jwt from "jsonwebtoken";

// Ce middleware :
// Intercepte chaque tentative de connexion WebSocket
// Vérifie le token JWT
// Attache les données de l'utilisateur à la connexion

export const socketAuth = (socket, next) => {
    const token = socket.handshake.auth.token;
    if(!token) {
        return next(new Error("Authentification requise"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch(error) {
        next(new Error("Token invalide"));
    }
}