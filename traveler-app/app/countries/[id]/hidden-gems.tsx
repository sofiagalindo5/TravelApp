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

type HiddenGem = {
  id: number;
  name: string;
  location?: string;
  description?: string;
  link?: string;
};

export default function HiddenGemsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [gems, setGems] = useState<HiddenGem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHiddenGems() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/${id}/`);
        const data = await response.json();
        setGems(data.hidden_gems ?? []);
      } catch (error) {
        console.log("Error loading hidden gems:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadHiddenGems();
  }, [id]);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.header}>Hidden Gems</Text>
        <Text style={styles.subtitle}>Secret spots worth finding</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#5a1e2c" />
            <Text style={styles.loadingText}>Loading gems...</Text>
          </View>
        ) : gems.length > 0 ? (
          gems.map((gem) => (
            <View key={gem.id} style={styles.card}>
              <View style={styles.cardAccent} />
              <View style={styles.cardBody}>
                <View style={styles.gemBadge}>
                  <Text style={styles.gemBadgeIcon}>💎</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.gemName}>{gem.name}</Text>
                  {gem.location ? (
                    <Text style={styles.location}>📍 {gem.location}</Text>
                  ) : null}
                  {gem.description ? (
                    <Text style={styles.description}>{gem.description}</Text>
                  ) : null}
                  {gem.link ? (
                    <Text style={styles.link}>{gem.link}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>💎</Text>
            <Text style={styles.emptyText}>No hidden gems available yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4efe6" },
  page: { paddingTop: 32, paddingHorizontal: 24, paddingBottom: 48 },
  header: { fontSize: 28, fontWeight: "800", color: "#3b1018", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#9e6b6b", marginBottom: 28, letterSpacing: 0.3 },
  center: { alignItems: "center", marginTop: 60, gap: 10 },
  loadingText: { fontSize: 14, color: "#9e6b6b" },
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
  cardAccent: { height: 4, backgroundColor: "#5a1e2c" },
  cardBody: { flexDirection: "row", alignItems: "flex-start", padding: 16, gap: 14 },
  gemBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f5ede0",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  gemBadgeIcon: { fontSize: 20 },
  cardContent: { flex: 1 },
  gemName: { fontSize: 16, fontWeight: "700", color: "#3b1018", marginBottom: 4 },
  location: { fontSize: 12, color: "#9e6b6b", fontWeight: "600", marginBottom: 8, letterSpacing: 0.2 },
  description: { fontSize: 14, color: "#7a4a4a", lineHeight: 21, marginBottom: 6 },
  link: { fontSize: 13, color: "#5a1e2c", fontWeight: "600", textDecorationLine: "underline" },
  emptyBox: { marginTop: 60, alignItems: "center", gap: 12 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 15, color: "#9e6b6b", textAlign: "center" },
});