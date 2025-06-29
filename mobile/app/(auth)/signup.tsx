import { useState } from 'react'
import {KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { styles } from "@/assets/styles/auth.styles";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/colors";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('');
    const [error, setError] = useState('')


    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        setError('');
        console.log(emailAddress, password)

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
            if (err.errors?.[0]?.code === "form_password_length_too_short") {
                setError("Passwords must be 8 characters or more.")
            } else {
                setError("An error occurred.")
            }
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        setError('');

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            if (err.errors?.[0]?.code === "form_password_length_too_short") {
                setError("Passwords must be 8 characters or more.")
            } else {
                setError("An error occurred.")
            }
        }
    }

    if (pendingVerification) {
        return (
            <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>Verify your email</Text>
                <TextInput
                    value={code}
                    placeholder="Enter your verification code"
                    onChangeText={(code) => setCode(code)}
                    style={[styles.verificationInput, error && styles.errorInput]}
                />
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
                <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Sign up</Text>
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
                    onChangeText={(email) => setEmailAddress(email)}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <Link href="/signin">
                        <Text style={styles.linkText}>Sign in</Text>
                    </Link>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}