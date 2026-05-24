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

type ProTip = {
  id: number;
  title: string;
  description: string;
};

export default function ProTipsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [tips, setTips] = useState<ProTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProTips() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/${id}/`);
        const data = await response.json();
        setTips(data.pro_tips ?? []);
      } catch (error) {
        console.log("Error loading pro tips:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadProTips();
  }, [id]);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.page}>

        <Text style={styles.header}>Pro Tips</Text>
        <Text style={styles.subtitle}>Local knowledge for your journey</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#5a1e2c" />
          </View>
        ) : tips.length > 0 ? (
          tips.map((tip, index) => (
            <View key={tip.id} style={styles.card}>
              <View style={styles.cardAccent} />
              <View style={styles.cardBody}>
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.description}>{tip.description}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyText}>No pro tips yet for this destination.</Text>
          </View>
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
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#3b1018",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#9e6b6b",
    marginBottom: 28,
    letterSpacing: 0.3,
  },
  center: {
    alignItems: "center",
    marginTop: 60,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#3b1018",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardAccent: {
    height: 4,
    backgroundColor: "#5a1e2c",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 14,
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5ede0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  tipNumberText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#5a1e2c",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b1018",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#7a4a4a",
    lineHeight: 21,
  },
  emptyBox: {
    marginTop: 60,
    alignItems: "center",
    gap: 12,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 15,
    color: "#9e6b6b",
    textAlign: "center",
  },
});