import {neon} from "@neondatabase/serverless"
import "dotenv/config";

// Initialize DB
export const sql = neon(process.env.DATABASE_URL);