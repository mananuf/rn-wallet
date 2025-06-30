import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import {SignOutButton} from "@/components/buttons/SignOutButton";
import {useTransactions} from "@/hooks/useTransactions";
import {useEffect} from "react";

export default function Page() {
    const { user } = useUser();
    const { transactions, deleteTransaction, loadData, loading} = useTransactions(user?.id)

    useEffect(() => {
        loadData();
    }, [loadData]);

    console.log(user?.id);
    console.log(transactions);
    return (
        <View>
            <SignedIn>
                <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
                <SignOutButton />
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