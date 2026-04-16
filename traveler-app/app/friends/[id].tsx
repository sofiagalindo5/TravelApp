import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../constants/api";

type CountryMini = {
  id: number;
  name: string;
};

type UpcomingTrip = {
  country: CountryMini;
  trip_date: string;
};

type PublicProfile = {
  id: number;
  username: string;
  display_name?: string;
  bio?: string;
  visited_count: number;
  visited_countries: CountryMini[];
  upcoming_trip?: UpcomingTrip | null;
};

export default function FriendProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const token = await SecureStore.getItemAsync("accessToken");

        if (!token) {
          setError("No access token found. Please log in again.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.detail ?? "Could not load profile");
        }

        setProfile(data);
      } catch (err: any) {
        console.log("Friend profile error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProfile();
    }
  }, [id]);

  const displayName = profile?.display_name || profile?.username || "Traveler";
  const bio = profile?.bio || "No bio yet.";
  const upcomingTrip = profile?.upcoming_trip;

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

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
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>‹ Back</Text>
            </Pressable>

            <View style={styles.headerContent}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>

              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.handle}>@{profile?.username}</Text>
              <Text style={styles.subtitle}>{bio}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.card}>
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
                      Nothing planned right now
                    </Text>
                  </>
                )}
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.cardIcon}>📍</Text>
                <Text style={styles.sectionTitle}>Travel Stats</Text>
              </View>

              <View style={styles.singleStatBox}>
                <Text style={styles.statNumber}>
                  {profile?.visited_count ?? 0}
                </Text>
                <Text style={styles.statLabel}>Countries Visited</Text>
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
    paddingTop: 18,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },

  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
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

  handle: {
    fontSize: 14,
    color: "#eadfce",
    marginBottom: 8,
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  cardIcon: {
    fontSize: 18,
    marginRight: 12,
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

  countryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  countryPill: {
    backgroundColor: "#f8f4ec",
    borderWidth: 1,
    borderColor: "#d8c7a1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  countryPillText: {
    color: "#5a1e2c",
    fontSize: 13,
    fontWeight: "600",
  },

  emptyText: {
    fontSize: 14,
    color: "#7a2d3f",
  },
});