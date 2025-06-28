import express from 'express';
import {
    createTransaction,
    deleteTransaction,
    getUserTransaction,
    getUserTransactionsSummary
} from "../controllers/transactions.js";

const router = express.Router();

router.post("/create", createTransaction);
router.get("/user/:userId", getUserTransaction);
router.delete("/delete/:id", deleteTransaction);
router.get('/summary/user/:userId', getUserTransactionsSummary);

export default router;