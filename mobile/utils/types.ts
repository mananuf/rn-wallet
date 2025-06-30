export interface Transaction {
    id: number;
    user_id: string;
    title: string;
    amount: string; // Keep as string since it comes from database as decimal string
    category: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}

export interface TransactionWithParsedAmount {
    id: number;
    user_id: string;
    title: string;
    amount: number; // Parsed to number for calculations
    category: string;
    created_at: Date; // Parsed to Date object
    updated_at: Date; // Parsed to Date object
}

export interface CreateTransactionRequest {
    user_id: string;
    title: string;
    amount: string | number;
    category: string;
}

export interface UpdateTransactionRequest {
    id: number;
    title?: string;
    amount?: string | number;
    category?: string;
}

export interface Summary {
    balance: string|number,
    income: string|number,
    expense: string|number
}

export type TransactionsList = Transaction[];