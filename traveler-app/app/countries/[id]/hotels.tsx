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


type Hotel = {
  id: number;
  name: string;
  city?: string;
  description?: string;
  price_level?: string;
};

type CountryDetail = {
  hotels?: Hotel[];
};

export default function HotelsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHotels() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/${id}/`);
        const data = await response.json();

        if (data.hotels) {
          setHotels(data.hotels);
        }
      } catch (error) {
        console.log("Error loading hotels:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadHotels();
  }, [id]);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.header}>Hotels</Text>
        <Text style={styles.subtitle}>Recommended places to stay</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#5a1e2c" />
            <Text style={styles.loadingText}>Loading hotels...</Text>
          </View>
        ) : hotels.length > 0 ? (
          hotels.map((hotel) => (
            <View key={hotel.id} style={styles.card}>
              <Text style={styles.hotelName}>{hotel.name}</Text>

              {hotel.city && (
                <Text style={styles.city}>{hotel.city}</Text>
              )}

              {hotel.description && (
                <Text style={styles.description}>
                  {hotel.description}
                </Text>
              )}

              {hotel.price_level && (
                <Text style={styles.price}>{hotel.price_level}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No hotels available yet.</Text>
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

  hotelName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#5a1e2c",
    marginBottom: 4,
  },

  city: {
    fontSize: 14,
    color: "#7a2d3f",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "#3b2a2a",
    lineHeight: 20,
  },

  price: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#5a1e2c",
  },

  empty: {
    marginTop: 20,
    fontSize: 15,
    color: "#7a2d3f",
  },
});