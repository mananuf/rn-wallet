import {View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {COLORS} from "@/constants/colors";
import React from "react";

interface SafeScreenProps {
    children: React.ReactNode;
}

export default SafeScreen = ({children}: SafeScreenProps) => {
    const inset = useSafeAreaInsets();
    return (
        <View style={{
            paddingTop: inset.top,
            flex: 1,
            backgroundColor: COLORS.background
        }}>
            {children}
        </View>
    )
};