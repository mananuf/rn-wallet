import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useUser} from "@clerk/clerk-expo";
import {useRouter} from "expo-router";
import {useState} from "react";
import {API_URL} from "@/constants/api";
import {styles} from "@/assets/styles/create.styles";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/colors";

interface Category {
    id: string;
    name: string;
    icon: string;
}

const CATEGRIES: Category[] = [
    {id: "food", name: "Food & Drinks", icon: "fast-food"},
    {id: "shopping", name: "Shopping", icon: "cart"},
    {id: "transportation", name: "Transportation", icon: "car"},
    {id: "entertainment", name: "Entertainment", icon: "film"},
    {id: "bills", name: "Bills", icon: "receipt"},
    {id: "income", name: "Income", icon: "cash"},
    {id: "other", name: "Other", icon: "ellipsis-horizontal"},
];

const CreateScreen = () => {
    const {user} = useUser();
    const router = useRouter();

    const [title, setTitle] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isExpense, setIsExpense] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCreate = async () => {
        if (!title.trim()) return Alert.alert("Error","Please enter title");
        if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return Alert.alert("Error","Please enter valid amount");
        if (!selectedCategory) return Alert.alert("Error","Please select a category");

        try {
            setIsLoading(true);

            const formattedAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

            const response = await fetch(`${API_URL}/api/transactions/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user?.id,
                    title,
                    amount: formattedAmount,
                    category: selectedCategory,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert("error", errorData || "Something went wrong");
                throw new Error(errorData || "failed to create transaction");
            }

            Alert.alert("Success", "Transaction successfully created!");
            router.back();

        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name={"arrow-back"} size={20} color={COLORS.text}/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Transaction</Text>
                <TouchableOpacity
                    onPress={handleCreate}
                    style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
                    disabled={isLoading}
                >
                    <Text style={styles.saveButton}>
                        { isLoading ? "Saving..." : "Save"}
                    </Text>
                    {!isLoading && <Ionicons name={"checkmark"} size={18} color={COLORS.primary} /> }
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        onPress={() => setIsExpense(true)}
                        style={[styles.typeButton, isExpense && styles.typeButtonActive]}
                    >
                        <Ionicons name={"arrow-down-circle"} size={18} color={ isExpense ? COLORS.white : COLORS.expense} />
                        <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>
                            Expense
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsExpense(false)}
                        style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
                    >
                        <Ionicons name={"arrow-up-circle"} size={18} color={ !isExpense ? COLORS.white : COLORS.income} />
                        <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>
                            Income
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder={"0.00"}
                        placeholderTextColor={COLORS.textLight}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType={"numeric"}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons style={styles.inputIcon} name={"create-outline"} size={18} color={COLORS.textLight} />
                    <TextInput
                        style={styles.input}
                        placeholder={"Transaction Title"}
                        placeholderTextColor={COLORS.textLight}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <Text style={styles.sectionTitle}>
                    <Ionicons name={"pricetag-outline"} size={18} color={COLORS.text} /> Category
                </Text>

                <View style={styles.categoryGrid}>
                    {
                        CATEGRIES.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                onPress={() => setSelectedCategory(category.name)}
                                style={[styles.categoryButton, selectedCategory === category.name && styles.categoryButtonActive]}
                            >
                                <Ionicons name={category.icon} size={18} color={ selectedCategory === category.name ? COLORS.white : COLORS.text} />
                                <Text style={[styles.categoryButtonText, selectedCategory === category.name && styles.categoryButtonTextActive]}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>

            {
                isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={"large"} color={COLORS.primary}/>
                    </View>
                )
            }
        </View>
    )
}

export default CreateScreen;
