import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { API_BASE_URL } from "../../../constants/api";

type SafetyTip = {
  id: number;
  title: string;
  description: string;
};

type CountryDetail = {
  safety_tips?: SafetyTip[];
};

export default function SafetyTipsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [tips, setTips] = useState<SafetyTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTips() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/${id}/`);
        const data = await response.json();

        if (data.safety_tips) {
          setTips(data.safety_tips);
        }
      } catch (error) {
        console.log("Error loading safety tips:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadTips();
  }, [id]);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.header}>Safety Tips</Text>
        <Text style={styles.subtitle}>Stay safe while traveling</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#5a1e2c" />
            <Text style={styles.loadingText}>Loading tips...</Text>
          </View>
        ) : tips.length > 0 ? (
          tips.map((tip) => (
            <View key={tip.id} style={styles.card}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.description}>{tip.description}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No safety tips available yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f4efe6",
  },

  page: {
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#5a1e2c",
  },

  subtitle: {
    fontSize: 14,
    color: "#7a2d3f",
    marginBottom: 20,
    marginTop: 4,
  },

  center: {
    alignItems: "center",
    marginTop: 40,
    gap: 10,
  },

  loadingText: {
    fontSize: 14,
    color: "#7a2d3f",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5a1e2c",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "#3b2a2a",
    lineHeight: 20,
  },

  empty: {
    marginTop: 20,
    fontSize: 15,
    color: "#7a2d3f",
  },
});