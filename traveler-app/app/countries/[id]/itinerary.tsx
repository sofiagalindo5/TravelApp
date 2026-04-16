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
              <Text style={styles.dayLabel}>Day {day.day_number}</Text>
              <Text style={styles.dayTitle}>{day.title}</Text>
              <Text style={styles.activities}>{day.activities}</Text>
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

  dayLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7a2d3f",
    marginBottom: 4,
  },

  dayTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5a1e2c",
    marginBottom: 8,
  },

  activities: {
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

