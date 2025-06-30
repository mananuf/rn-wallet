import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import {Alert, Text, TouchableOpacity} from 'react-native'
import {styles} from "@/assets/styles/home.styles";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/colors";

export const SignOutButton = () => {
    // Use `useClerk()` to access the `signOut()` function
    const { signOut } = useClerk()

    const handleSignOut = async () => {
        Alert.alert("Logout", "are you sure you want to logout?", [
            {text: "Logout", style:"destructive", onPress: () => signOut()},
            {text: "Cancel", style:"cancel"}
        ]);
    }

    return (
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
            <Ionicons name={"log-out-outline"} size={20} color={COLORS.text} />
        </TouchableOpacity>
    )
}