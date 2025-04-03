import { socketAuth } from "./middleware.js";
import client from "../database.js"

const initializeSocket = (io) => {

    io.use(socketAuth);

    io.on("connection", async (socket) => {
        try {
            console.log(`${socket.user.username} est en ligne`);

            await client.query(
                `UPDATE users SET is_online = TRUE WHERE id = $1`,
                [socket.user.id]
            );
            socket.join(`user_${socket.user.id}`);
            console.log(`Utilisateur ${socket.user.username} a rejoint la room: user_${socket.user.id}`);

            socket.on("chat message", async(data) => {
                try {
                    const {recipient_id, content} = data;
                    const query = `
                        INSERT INTO messages (sender_id, recipient_id, content)
                        VALUES ($1, $2, $3)
                        RETURNING *
                    `;
                    const values = [socket.user.id, recipient_id, content];
                    const {rows} = await client.query(query, values);
                    console.log(`Envoi du message à la room: user_${recipient_id}`);
                    console.log('Rooms actuelles:', socket.rooms);
                    
                    io.to(`user_${recipient_id}`).emit("private_message", {
                        id: rows[0].id,
                        senderId: socket.user.id,
                        senderName: socket.user.username,
                        content: content,
                        timestamp: rows[0].created_at
                    });
                } catch (error) {
                    console.error("Erreur envoi message:", error);
                }
            });

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

