import express from "express";
import dotenv from 'dotenv';
import client from "./database.js";
import contactsRoute from "../backend/routes/contacts.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
dotenv.config();


const connect = async () => {
    try {
        await client.connect();
        app.use(express.json());
        const port = process.env.port || 3000;
        app.listen (port, () => {
            console.log(`Server running on port ${port}`);
        });
        app.use("/api/contacts", contactsRoute);
        app.use(errorHandler);
        console.log("Connecté à la base de données :", client.database);
    } catch(error) {
        console.log(error, "Erreur lors de connexion à la BDD")
    }
}

connect();