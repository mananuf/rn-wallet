import {useCallback, useState} from "react";
import {Summary, TransactionsList} from "@/utils/types";
import dotenv from "dotenv";
import {Alert} from "react-native";

const API_URL=process.env.API_URL || "http://192.168.19.120:7001";

export const useTransactions = (userId: string|number) => {
    const [transactions, setTransactions] = useState<TransactionsList>([]);
    const [summary, setSummary] = useState<Summary>();
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        try {
            console.log("Fetching transactions...", `${API_URL}/api/transactions/user/${userId}`);
            const response = await fetch(`${API_URL}/api/transactions/user/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error("transactions error: ", error);
        }
    }, [userId])

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/api/transactions/summary/user/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error(error);
        }
    }, [userId])

    const deleteTransaction = async (id:number|string) => {
        try {
            const response = await fetch(`${API_URL}/api/transactions/delete/${id}`);
            const data = await response.json();

            loadData();
            Alert.alert("success", "Transaction deleted");
        } catch (error) {
            console.error(error);
            Alert.alert("error", error.message);
        }
    }

    const loadData = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [fetchTransactions, fetchSummary])

    return {transactions, summary, loading, deleteTransaction, loadData}
}