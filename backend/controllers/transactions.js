import {sql} from "../config/db.js";

export const createTransaction = async (req, res) => {
    try {
        const { title, amount, category, user_id } = req.body;
        if (!title || !user_id || !category || amount == undefined) {
            res.status(400).json({ message: "fields can not be empty" });
        }

        const transaction = await sql`
                                    INSERT INTO transactions(user_id,title,amount,category)
                                    VALUES (${user_id}, ${title}, ${amount}, ${category})
                                    RETURNING *
                                    `;

        console.log(transaction);
        res.status(201).json({
            message: "Transaction successfully created",
            transaction: transaction[0]}
        );
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Failed to create transaction" });
    }
}

export const getUserTransaction = async (req, res) => {
    try {
        const {userId} = req.params;
        console.log(userId);
        if (!userId) {
            res.status(400).json({ message: "userId must be specified" });
        }

        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;

        console.log(transactions);
        res.status(200).json({
            message: "Transactions retrieved successfully",
            transaction: transactions,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Failed to get user transactions" });
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const transaction = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

        if (transaction.length === 0) {
            res.status(404).json({ message: "transaction not found" });
        }

        res.status(200).json({message: "Transaction deleted successfully"});
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Failed to delete transaction" });
    }
}

export const getUserTransactionsSummary = async (req, res) => {
    try {
        const {userId} = req.params;
        if (!userId) {
            res.status(400).json({ message: "userId must be specified" });
        }

        const balance = await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}`;
        const income = await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`;
        const expense = await sql`SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0`;

        console.log("BALANCE:", balance, "\nINCOME", income, "\nEXPENSE", expense);
        res.status(200).json({
            message: "Transaction Summary retrieved successfully",
            balance: balance[0].balance,
            income: income[0].income,
            expense: expense[0].expense,
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Failed to get user transactions summary" });
    }
}