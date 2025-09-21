// src/screens/LoginScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info ⚠️", "Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success ✅", "Logged in successfully!");
      // ✅ No navigation.replace("Home")
      // AppNavigator will detect user and load AppStack → Home
    } catch (error) {
      Alert.alert("Login Error ❌", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.logo}>🐷 PigConnect</Text>
          <Text style={styles.subtitle}>Stay Connected, Anytime.</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.signInBtn} onPress={handleLogin}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupText}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF4D85",
    textAlign: "center",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: "#FF4D85",
    marginBottom: 30,
    textAlign: "center"
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#FFB3C6",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#fff"
  },
  signInBtn: {
    backgroundColor: "#FF4D85",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 15
  },
  signInText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  signupContainer: { flexDirection: "row", justifyContent: "center" },
  signupText: { color: "#FF4D85", fontWeight: "bold" }
});

export default LoginScreen;
