import { socketAuth } from "./middleware.js";
import client from "../database.js"

const initializeSocket = (io) => {

    io.use(socketAuth);

    io.on("connection", async (socket) => {
        try {
            console.log(`${socket.user.username} est en ligne`);

            // Met à jour le statut "en ligne" dans la base de données
            await client.query(
                `UPDATE users SET is_online = TRUE WHERE id = $1`,
                [socket.user.id]
            );

            io.emit("user_connected", {
                id: socket.user.id,
                username: socket.user.username
            });

            socket.on("disconnect", async () => {
                try {
                    console.log(`${socket.user.username} s'est déconnecté`);
                    await client.query(
                        `UPDATE users SET is_online = FALSE WHERE id = $1`,
                        [socket.user.id]
                    );
                    io.emit("userDisconnected", { id: socket.user.id });
                } catch (error) {
                    console.error("Erreur déconnexion:", error);
                }
            });

        } catch (error) {
            console.error("Erreur connexion:", error);
        }
    });
};

export default initializeSocket;

