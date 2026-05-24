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

type ItineraryDay = {
  id: number;
  day_number: number;
  title: string;
  activities: string;
};

export default function ItineraryScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItinerary() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/${id}/`);
        const data = await response.json();

        if (data.itinerary_days) {
          setItineraryDays(data.itinerary_days);
        } else {
          setItineraryDays([]);
        }
      } catch (error) {
        console.log("Error loading itinerary:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadItinerary();
    }
  }, [id]);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.header}>Weekend Itinerary</Text>
        <Text style={styles.subtitle}>Plan your perfect trip</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#5a1e2c" />
            <Text style={styles.loadingText}>Loading itinerary...</Text>
          </View>
        ) : itineraryDays.length > 0 ? (
            itineraryDays.map((day) => (
          <View key={day.id} style={styles.card}>
            <View style={styles.cardAccent} />
            <View style={styles.cardBody}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>Day</Text>
                <Text style={styles.dayBadgeNumber}>{day.day_number}</Text>
              </View>
              <View style={styles.dayContent}>
                <Text style={styles.dayTitle}>{day.title}</Text>
                <Text style={styles.activities}>{day.activities}</Text>
              </View>
            </View>
          </View>
        ))
        ) : (
          <Text style={styles.empty}>No itinerary available yet.</Text>
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
  dayBadge: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "#f5ede0",
    justifyContent: "center", alignItems: "center",
    flexShrink: 0, marginTop: 2,
  },
  dayBadgeText: { fontSize: 9, fontWeight: "700", color: "#5a1e2c", letterSpacing: 0.8, textTransform: "uppercase" },
  dayBadgeNumber: { fontSize: 16, fontWeight: "800", color: "#5a1e2c", lineHeight: 18 },
  dayContent: { flex: 1 },
  dayTitle: { fontSize: 16, fontWeight: "700", color: "#3b1018", marginBottom: 6 },
  activities: { fontSize: 14, color: "#7a4a4a", lineHeight: 21 },
  emptyBox: { marginTop: 60, alignItems: "center", gap: 12 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 15, color: "#9e6b6b", textAlign: "center" },
});