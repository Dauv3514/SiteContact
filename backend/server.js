import express from "express";
import dotenv from 'dotenv';
import client from "./database.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import contactsRoute from "../backend/routes/contacts.js";
import favorisRoute from "../backend/routes/favoris.js";
import authRoute from "../backend/routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
dotenv.config();


const connect = async () => {
    try {
        await client.connect();
        app.use(express.json());
        app.use(cors({
            origin: "http://localhost:5173",
            credentials: true
        }));
        app.use(cookieParser()); 
        const port = process.env.port || 3000;
        app.listen (port, () => {
            console.log(`Server running on port ${port}`);
        });
        app.use("/api/favoris", favorisRoute);
        app.use("/api/contacts", contactsRoute);
        app.use("/api/auth", authRoute);
        app.use(errorHandler);
        console.log("Connecté à la base de données :", client.database);
    } catch(error) {
        console.log(error, "Erreur lors de connexion à la BDD")
    }
}

connect();