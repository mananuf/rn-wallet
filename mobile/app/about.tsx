import {Text, View} from "react-native";
import {Image} from "expo-image";

const About = () => {
    return (
        <View>
            <Image source={{
                uri: "https://images.unsplash.com/photo-1720884413532-59289875c3e1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D"
            }}
           style={{
               height: 600,
               width: 500,
           }}
            />
            <Text>About</Text>
        </View>
    )
}

export default About;