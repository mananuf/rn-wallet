import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {styles} from "@/assets/styles/auth.styles";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/colors";

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('');

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return

        setError('');
        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
            if (err.clerkError && err.errors && err.errors.length > 0) {
                // Get the first error message
                setError(err.errors[0].message || err.errors[0].longMessage || 'An error occurred');
            } else {
                // Handle other types of errors
                setError(err.message || 'An unexpected error occurred');
            }
        }
    }

    return (
        <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Sign in</Text>
                {
                    error ?(
                        <View style={styles.errorBox}>
                            <Ionicons name={"alert-circle"} size={20} color={COLORS.expense}/>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity onPress={() => setError("")}>
                                <Ionicons name={"close"} size={20} color={COLORS.textLight}/>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity onPress={onSignInPress} style={styles.button}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Link href="/signup">
                        <Text style={styles.linkText}>Sign up</Text>
                    </Link>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}