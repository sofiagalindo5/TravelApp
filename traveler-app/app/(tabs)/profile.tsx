import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../constants/api";
import { useFocusEffect } from "@react-navigation/native";

type CountryMini = {
  id: number;
  name: string;
};

type UpcomingTrip = {
  country: CountryMini;
  trip_date: string;
};

type ProfileData = {
  display_name?: string;
  bio?: string;
  visited_count?: number;
  visited_countries?: CountryMini[];
  upcoming_trip?: UpcomingTrip | null;
};

type MeResponse = {
  id: number;
  username: string;
  email: string;
  profile: ProfileData | null;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchMe();
    }, [])
  );

  const fetchMe = async () => {
    try {
      setLoading(true);
      setError("");

      let accessToken = await SecureStore.getItemAsync("accessToken");

      if (!accessToken) {
        setError("No access token found. Please log in again.");
        return;
      }

      let response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
          setError("Session expired. Please log in again.");
          return;
        }

        const refreshResponse = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        });

        const refreshData = await refreshResponse.json();

        if (!refreshResponse.ok || !refreshData.access) {
          setError("Session expired. Please log in again.");
          return;
        }

        accessToken = refreshData.access;
        await SecureStore.setItemAsync("accessToken", accessToken);

        response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail ?? "Could not load profile");
      }

      setUser(data);
    } catch (err: any) {
      console.log("fetchMe error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.profile?.display_name || user?.username || "User";
  const bio = user?.profile?.bio || "Welcome to your travel profile";
  const visitedCount = user?.profile?.visited_count ?? 0;
  const upcomingTrip = user?.profile?.upcoming_trip;

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5a1e2c" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.subtitle}>{bio}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.cardBody}>
                <Text style={styles.cardIcon}>✉️</Text>
                <View>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>{user?.email}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardBody}>
                <Text style={styles.cardIcon}>👤</Text>
                <View>
                  <Text style={styles.label}>Username</Text>
                  <Text style={styles.value}>{user?.username}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.cardIcon}>📅</Text>
                  <Text style={styles.sectionTitle}>Upcoming Trip</Text>
                </View>

                <View style={styles.tripCard}>
                  {upcomingTrip ? (
                    <>
                      <Text style={styles.tripLocation}>
                        {upcomingTrip.country.name}
                      </Text>
                      <Text style={styles.tripSubtitle}>Planned Trip</Text>
                      <Text style={styles.tripDate}>{upcomingTrip.trip_date}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.tripLocation}>No upcoming trip yet</Text>
                      <Text style={styles.tripSubtitle}>
                        RSVP to a country to see it here
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.cardIcon}>📍</Text>
                  <Text style={styles.sectionTitle}>Travel Stats</Text>
                </View>

                <View style={styles.singleStatBox}>
                  <Text style={styles.statNumber}>{visitedCount}</Text>
                  <Text style={styles.statLabel}>Countries Visited</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f4efe6",
  },

  scrollContent: {
    paddingBottom: 32,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#7a2d3f",
  },

  errorText: {
    fontSize: 14,
    color: "#7a2d3f",
    textAlign: "center",
  },

  header: {
    backgroundColor: "#8d1035ff",
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerContent: {
    alignItems: "center",
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#f8f4ec",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#5a1e2c",
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#eadfce",
    textAlign: "center",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  cardBody: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardContent: {
    flex: 1,
  },

  cardIcon: {
    fontSize: 18,
    marginRight: 12,
  },

  label: {
    fontSize: 12,
    color: "#7a2d3f",
    marginBottom: 2,
  },

  value: {
    fontSize: 14,
    color: "#3b2a2a",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5a1e2c",
  },

  tripCard: {
    marginTop: 4,
  },

  tripLocation: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5a1e2c",
  },

  tripSubtitle: {
    fontSize: 13,
    color: "#7a2d3f",
    marginTop: 4,
  },

  tripDate: {
    fontSize: 12,
    color: "#3b2a2a",
    marginTop: 4,
  },

  singleStatBox: {
    alignItems: "center",
    paddingVertical: 4,
  },

  statNumber: {
    fontSize: 30,
    fontWeight: "700",
    color: "#5a1e2c",
  },

  statLabel: {
    fontSize: 13,
    color: "#7a2d3f",
    marginTop: 4,
  },
});