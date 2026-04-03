import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

// add near imports or top of file
const API_BASE_URL = "http://192.168.4.211:8000"; // <-- replace with your laptop IP

export default function LoginScreen() {
  const [email, setEmail] = useState("");     // (this is really username for now)
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
  try {
    console.log("Attempting login...");

    const res = await fetch(`${API_BASE_URL}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    console.log("Status:", res.status);

    const data = await res.json();
    console.log("Response:", data);

    if (!res.ok) {
      throw new Error(data?.detail ?? "Login failed");
    }

    await SecureStore.setItemAsync("accessToken", data.access);
    await SecureStore.setItemAsync("refreshToken", data.refresh);

    console.log("Login success. Navigating...");
    router.replace("/(tabs)");
  } catch (err: any) {
    console.log("Login error:", err?.message ?? String(err));
  }
};

  return (
    <View style={styles.page}>
      {/* Phone frame is optional in RN. Usually you skip it. */}
      <View style={styles.phoneBody}>
        <LinearGradient
          colors={["#fef2f2", "#fee2e2"]} // red-50 -> red-100
          style={styles.screen}
        >
          {/* “Dynamic island” */}
          <View style={styles.island} />

          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Lock size={28} color="#ffffff" />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputRow}>
                <Mail size={18} color="#f87171" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              {/* Password */}
              <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
              <View style={styles.inputRow}>
                <Lock size={18} color="#f87171" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={10}>
                  {showPassword ? (
                    <EyeOff size={18} color="#f87171" />
                  ) : (
                    <Eye size={18} color="#f87171" />
                  )}
                </Pressable>
              </View>

              {/* Login button */}
              <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
              </Pressable>

              {/* Sign up */}
              <View style={styles.signupRow}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <Pressable onPress={() => console.log("Go to Sign Up")}>
                  <Text style={styles.signupLink}>Sign up</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#111827", // gray-900
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  phoneBody: {
    width: 390,
    height: 844,
    backgroundColor: "#000000",
    borderRadius: 60,
    padding: 12,
  },
  screen: {
    flex: 1,
    borderRadius: 50,
    overflow: "hidden",
  },
  island: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: [{ translateX: -60 }],
    width: 120,
    height: 35,
    backgroundColor: "#000",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingTop: 70,
    paddingBottom: 24,
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 18,
  },
  header: { alignItems: "center" },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#dc2626", // red-600
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: { fontSize: 28, fontWeight: "700", color: "#7f1d1d" }, // red-900-ish
  subtitle: { marginTop: 6, color: "#b91c1c" }, // red-700-ish

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  label: { color: "#7f1d1d", fontWeight: "600", marginBottom: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fef2f2", // red-50
    borderColor: "#fecaca", // red-200
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 16, color: "#111827" },

  button: {
    marginTop: 18,
    backgroundColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  signupText: { color: "#b91c1c" },
  signupLink: { color: "#dc2626", fontWeight: "700" },
});