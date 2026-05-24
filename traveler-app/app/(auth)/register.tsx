import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet,
  Animated, Easing, KeyboardAvoidingView, Platform,
  StatusBar, ScrollView,
} from "react-native";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { API_BASE_URL } from "../../constants/api";
import { Image } from "react-native";


export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState("");

  const planeX = useRef(new Animated.Value(-60)).current;
  const planeY = useRef(new Animated.Value(0)).current;
  const planeRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.sequence([
      Animated.parallel([
        Animated.timing(planeX, { toValue: 420, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(planeY, { toValue: -30, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(planeY, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(planeRotate, { toValue: -1, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(planeRotate, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ]),
      Animated.parallel([
        Animated.timing(planeX, { toValue: -60, duration: 0, useNativeDriver: true }),
        Animated.timing(planeY, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(planeRotate, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
      Animated.delay(1800),
    ]);
    Animated.loop(loop).start();
  }, []);

  const rotateDeg = planeRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-8deg", "8deg"],
  });

  const handleRegister = async () => {
    setError("");
    if (!username || !email || !password || !password2) {
      setError("All fields are required.");
      return;
    }
    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, password2 }),
      });
      const data = await res.json();
      if (!res.ok) {
        const messages = Object.values(data).flat().join(" ");
        setError(messages || "Registration failed.");
        return;
      }
      await SecureStore.setItemAsync("accessToken", data.access);
      await SecureStore.setItemAsync("refreshToken", data.refresh);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.sky}>
        <View style={[styles.cloud, { top: 60, left: 30, opacity: 0.18 }]} />
        <View style={[styles.cloud, { top: 90, left: 60, width: 80, height: 22, opacity: 0.12 }]} />
        <View style={[styles.cloud, { top: 130, right: 40, opacity: 0.15 }]} />
        <View style={[styles.cloud, { top: 155, right: 70, width: 70, height: 18, opacity: 0.1 }]} />
        <Animated.Image
        source={require("../../assets/images/plane.png")}
        style={[styles.plane, { transform: [{ translateX: planeX }, { translateY: planeY }, { rotate: rotateDeg }] }]}
        />
      </View>

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pill} />
        <Text style={styles.title}>New adventure?</Text>
        <Text style={styles.subtitle}>Create your traveler account</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.label}>Username</Text>
        <View style={styles.inputRow}>
          <User size={16} color="#9e6b6b" />
          <TextInput value={username} onChangeText={setUsername}
            placeholder="yourname" placeholderTextColor="#c4a8a8"
            autoCapitalize="none" style={styles.input} />
        </View>

        <Text style={[styles.label, { marginTop: 14 }]}>Email</Text>
        <View style={styles.inputRow}>
          <Mail size={16} color="#9e6b6b" />
          <TextInput value={email} onChangeText={setEmail}
            placeholder="you@example.com" placeholderTextColor="#c4a8a8"
            autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        </View>

        <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
        <View style={styles.inputRow}>
          <Lock size={16} color="#9e6b6b" />
          <TextInput value={password} onChangeText={setPassword}
            placeholder="At least 8 characters" placeholderTextColor="#c4a8a8"
            secureTextEntry={!showPassword} style={styles.input} />
          <Pressable onPress={() => setShowPassword(s => !s)}>
            {showPassword ? <EyeOff size={16} color="#9e6b6b" /> : <Eye size={16} color="#9e6b6b" />}
          </Pressable>
        </View>

        <Text style={[styles.label, { marginTop: 14 }]}>Confirm Password</Text>
        <View style={styles.inputRow}>
          <Lock size={16} color="#9e6b6b" />
          <TextInput value={password2} onChangeText={setPassword2}
            placeholder="Repeat password" placeholderTextColor="#c4a8a8"
            secureTextEntry={!showPassword2} style={styles.input} />
          <Pressable onPress={() => setShowPassword2(s => !s)}>
            {showPassword2 ? <EyeOff size={16} color="#9e6b6b" /> : <Eye size={16} color="#9e6b6b" />}
          </Pressable>
        </View>

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account  →</Text>
        </Pressable>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Already have an account? </Text>
          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.signupLink}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1a0a10" },
    sky: {
    height: 160,          // ← fixed small height instead of flex: 1
    backgroundColor: "#5a1e2c",
    overflow: "hidden",
    justifyContent: "center",
    },
    plane: {
    position: "absolute",
    width: 52,
    height: 52,
    top: "60%",
    tintColor: "#ffffff",  // ← turns the black icon white
    },
  flightPath: { position: "absolute", top: "48%", left: 0, right: 0, height: 1, borderStyle: "dashed", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  sheet: { flex: 1, backgroundColor: "#fff9eb", borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetContent: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 48 },
  pill: { width: 40, height: 4, backgroundColor: "#e0c8b0", borderRadius: 2, alignSelf: "center", marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "800", color: "#3b1018", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#9e6b6b", marginBottom: 24 },
  errorText: { color: "#b91c1c", backgroundColor: "#fee2e2", borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 13, textAlign: "center" },
  label: { fontSize: 12, fontWeight: "700", color: "#7a2d3f", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#f5ede0", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: "#e8d5be" },
  input: { flex: 1, fontSize: 15, color: "#3b1018" },
  button: { marginTop: 24, backgroundColor: "#5a1e2c", borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  buttonText: { color: "#fff9eb", fontWeight: "800", fontSize: 16, letterSpacing: 0.5 },
  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  signupText: { color: "#9e6b6b", fontSize: 14 },
  signupLink: { color: "#5a1e2c", fontWeight: "800", fontSize: 14 },
});