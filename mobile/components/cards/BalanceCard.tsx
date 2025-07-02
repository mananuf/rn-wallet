import {Summary} from "@/utils/types";
import {Text, View} from "react-native";
import {styles} from "@/assets/styles/home.styles";
import {COLORS} from "@/constants/colors";

export const BalanceCard = ({balance, income, expense}: Summary) => {
    return (
        <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>
                Balance
            </Text>
            <Text style={styles.balanceAmount}>
                ${Number(balance).toFixed(2)}
            </Text>
            <View style={styles.balanceStats}>
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Income</Text>
                    <Text style={[styles.balanceStatAmount, {color: COLORS.income}]}>
                    +${Number(income).toFixed(2)}
                    </Text>
                </View>
                <View style={[styles.balanceStatItem, styles.statDivider]}/>
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Expense</Text>
                    <Text style={[styles.balanceStatAmount, {color: COLORS.expense}]}>
                        -${Number(expense.toString().split("-")[1]).toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    )
}