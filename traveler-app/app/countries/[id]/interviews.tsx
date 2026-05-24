import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../../constants/api";

type Interview = {
  id: number;
  person_name: string;
  title_or_role?: string;
  quote: string;
  full_story?: string;
};

export default function InterviewsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInterviews() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/${id}/`);
        const data = await response.json();
        setInterviews(data.personal_interviews ?? []);
      } catch (error) {
        console.log("Error loading interviews:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadInterviews();
  }, [id]);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.header}>Personal Interviews</Text>
        <Text style={styles.subtitle}>Voices from the destination</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#5a1e2c" />
            <Text style={styles.loadingText}>Loading interviews...</Text>
          </View>
        ) : interviews.length > 0 ? (
          interviews.map((interview) => (
            <View key={interview.id} style={styles.card}>
              <View style={styles.cardAccent} />
              <View style={styles.cardBody}>
                <View style={styles.avatarBadge}>
                  <Text style={styles.avatarText}>
                    {interview.person_name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.name}>{interview.person_name}</Text>
                  {interview.title_or_role ? (
                    <Text style={styles.role}>{interview.title_or_role}</Text>
                  ) : null}
                  <Text style={styles.quote}>"{interview.quote}"</Text>
                  {interview.full_story ? (
                    <Text style={styles.story}>{interview.full_story}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🎙️</Text>
            <Text style={styles.emptyText}>No interviews available yet.</Text>
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
  avatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5ede0",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: "#5a1e2c" },
  cardContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#3b1018", marginBottom: 2 },
  role: { fontSize: 12, fontWeight: "600", color: "#9e6b6b", marginBottom: 8, letterSpacing: 0.3 },
  quote: { fontSize: 14, fontStyle: "italic", color: "#5a1e2c", lineHeight: 21, marginBottom: 8 },
  story: { fontSize: 14, color: "#7a4a4a", lineHeight: 21 },
  emptyBox: { marginTop: 60, alignItems: "center", gap: 12 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 15, color: "#9e6b6b", textAlign: "center" },
});