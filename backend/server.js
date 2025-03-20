import express from "express";
import dotenv from 'dotenv';
import contactsRoute from "../backend/routes/contacts.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
dotenv.config();


const connect = async () => {
    try {
        app.use(express.json());
        const port = process.env.port || 3000;
        app.listen (port, () => {
            console.log(`Server running on port ${port}`);
        });
        app.use("/api/contacts", contactsRoute);
        app.use(errorHandler);
    } catch(error) {
        console.log(error, "erreur lors de la connexion à la BDD")
    }
}

connect();