import PostgreSQL from 'pg';
const { Client } = PostgreSQL;
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT   
});

export default client;