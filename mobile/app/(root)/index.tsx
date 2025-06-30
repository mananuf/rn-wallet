import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import {Link, useRouter} from 'expo-router'
import {Alert, FlatList, RefreshControl, Text, TouchableOpacity, View} from 'react-native'
import {SignOutButton} from "@/components/buttons/SignOutButton";
import {useTransactions} from "@/hooks/useTransactions";
import {useEffect, useState} from "react";
import PageLoader from "@/components/loader/PageLoader";
import {styles} from "@/assets/styles/home.styles";
import {Ionicons} from "@expo/vector-icons";
import {BalanceCard} from "@/components/cards/BalanceCard";
import {TransactionItem} from "@/components/TransactionItem";

export default function Page() {
    const { user } = useUser();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { transactions, deleteTransaction, loadData, loading, summary} = useTransactions(user?.id)

    const handleDelete = (id: number|string) => {
        Alert.alert("Delete","Are you sure you want to delete this transaction?",[
            {text: "Cancel", style: "cancel"},
            {text: "Delete", onPress: () => deleteTransaction(id)}
        ]);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }

    useEffect(() => {
        loadData();
    }, [loadData]);

    console.log(transactions);

    if (loading) return <PageLoader />;
    return (
        <View style={styles.container}>
            <SignedIn>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.welcomeContainer}>
                                <Text style={styles.welcomeText}>
                                    Welcome
                                </Text>
                                <Text style={styles.usernameText}>
                                    {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                                <Ionicons name={"add"} size={10} color="#fff" />
                                <Text style={styles.addButtonText}>Add</Text>
                            </TouchableOpacity>
                            <SignOutButton />
                        </View>
                    </View>
                    {
                        summary ? (
                            <BalanceCard balance={summary.balance} income={summary.income} expense={summary.expense}/>
                        ) : null
                    }
                </View>
                <FlatList
                    style={styles.transactionsList}
                    contentContainerStyle={styles.transactionsListContent}
                    data={transactions}
                    renderItem={({item}) =>
                        <TransactionItem item={item} onDelete={handleDelete}/>
                    }
                    ListEmptyComponent={<Text>No Transactions found</Text>}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl onRefresh={onRefresh}/>}
                />
            </SignedIn>
            <SignedOut>
                <Link href={"/(auth)/signin"}>
                    <Text>Sign in</Text>
                </Link>
                <Link href={"/(auth)/signup"}>
                    <Text>Sign up</Text>
                </Link>
            </SignedOut>
        </View>
    )
}