import express from 'express';
import dotenv from 'dotenv';
import {sql} from "./config/db.js";
import transactionRoutes from "./routes/transaction.js";
import {rateLimiter} from "./middleware/rateLimiter.js";

const app = express();
const port = process.env.PORT || 7000;


app.use(express.json());
app.use(rateLimiter);
app.use('/api/transactions', transactionRoutes);

async function initializeDb() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(20,9) NOT NULL,
            category_id VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT now(),
            updated_at DATE NOT NULL DEFAULT now()
                   )`;

        console.log("Database Connected successfully.");
    } catch (error) {
        console.log("DB ERROR", error);
        process.exit(1);
    }
}

initializeDb().then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    })
})
