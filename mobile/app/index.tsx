import {StyleSheet, Text, View} from "react-native";
import {Link} from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={{
          color: "white"
      }}>Edit app/index.tsx to edit this screen.</Text>
        <Link href={"/about"}>about us</Link>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "green",
    }
})
