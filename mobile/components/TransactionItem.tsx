import {View, Text, TouchableOpacity} from "react-native";
import {styles} from "@/assets/styles/home.styles";
import {Transaction} from "@/utils/types";
import {COLORS} from "@/constants/colors";
import {Ionicons} from "@expo/vector-icons";
import {formatDate} from "@/utils/helpers";

interface TransactionItemProps {
    item: Transaction;
    onDelete: (id: number|string) => void;
}

type categoryIcons = {
    Shopping: string;
    Transportation: string;
    Entertainment: string;
    Bills: string;
    Income: string;
    Other: string;
    [key: string]: string;

}

const CATEGORY_ICONS: categoryIcons = {
    Shopping: 'cart',
    Transportation: 'car',
    Entertainment: 'film',
    Bills: 'receipt',
    Income: 'cash',
    Other: 'ellipsis-horizontal',
};

export const TransactionItem = ({item, onDelete}: TransactionItemProps) => {
    const isIncome = Number(item.amount) > 0;
    const iconName = CATEGORY_ICONS[item.category] || "cart";
    return (
        <View style={styles.transactionCard} key={item.id}>
            <TouchableOpacity style={styles.transactionContent}>
                <View style={styles.categoryIconContainer}>
                    <Ionicons name={"cart"} size={22} color={isIncome ? COLORS.income: COLORS.expense} />
                        </View>
                        <View style={styles.transactionLeft}>
                        <Text style={styles.transactionTitle}>{item.title}</Text>
                        <Text style={styles.transactionCategory}>{item.category}</Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: isIncome ? COLORS.income: COLORS.expense }]}>
                        {isIncome ? `+$${Number(item.amount).toFixed(2)}` : `-$${Number(item.amount.split("-")[1]).toFixed(2)}`}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
                <Ionicons name={"trash-outline"} size={22} color={COLORS.expense} />
            </TouchableOpacity>
        </View>
    )
}