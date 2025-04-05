import { socketAuth } from "./middleware.js";
import client from "../database.js"

const initializeSocket = (io) => {

    io.use(socketAuth);

    io.on("connection", async (socket) => {
        try {
            await client.query(
                `UPDATE users SET is_online = TRUE WHERE id = $1`,
                [socket.user.id]
            );
            socket.join(`user_${socket.user.id}`);

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

            socket.on("fetchMessages", async({userId}) => {
                try {
                    const query =`
                        SELECT content, sender_id, recipient_id
                        FROM messages
                        WHERE (sender_id = $1 AND recipient_id = $2)
                        OR (sender_id = $2 AND recipient_id = $1)
                        ORDER BY created_at ASC
                    `
                    const values = [socket.user.id, userId];
                    const {rows} = await client.query(query, values);
                    
                    const formattedMessages = rows.map(message => {
                        const senderId = Number(message.sender_id);
                        const currentUserId = Number(socket.user.id);
                        const isOwn = senderId === currentUserId;
                
                        return {
                            id: message.id,
                            content: message.content,
                            senderId: message.sender_id,
                            timestamp: message.created_at,
                            isOwn: isOwn
                        };
                    });
                    socket.emit("message_history", formattedMessages);
                } catch(err) {
                    console.error('Erreur lors de la récupération des messages:', err);
                }
            })

        } catch (error) {
            console.error("Erreur connexion:", error);
        }
    });
};

export default initializeSocket;

