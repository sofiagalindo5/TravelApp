import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../constants/api"; // adjust path if needed

type ProfileData = {
  display_name?: string;
  bio?: string;
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

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await SecureStore.getItemAsync("accessToken");
      console.log("Saved token exists:", !!token);

      if (!token) {
        setError("No access token found. Please log in again.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
        method: "GET",
        headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
        },
      });

      console.log("Me status:", response.status);

      const data = await response.json();
      console.log("Me response:", data);

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

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
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
              <View style={styles.leftBorder} />
              <View style={styles.cardBody}>
                <Text style={styles.cardIcon}>✉️</Text>
                <View>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>{user?.email}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.leftBorder} />
              <View style={styles.cardBody}>
                <Text style={styles.cardIcon}>👤</Text>
                <View>
                  <Text style={styles.label}>Username</Text>
                  <Text style={styles.value}>{user?.username}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.leftBorder} />
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.cardIcon}>📅</Text>
                  <Text style={styles.sectionTitle}>Upcoming Trip</Text>
                </View>

                <View style={styles.tripCard}>
                  <Text style={styles.tripLocation}>Cancun, Mexico</Text>
                  <Text style={styles.tripSubtitle}>Spring Break 2026</Text>
                  <Text style={styles.tripDate}>March 15 – March 22</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
  <View style={styles.leftBorder} />
  <View style={styles.cardContent}>
    <View style={styles.sectionHeader}>
      <Text style={styles.cardIcon}>📍</Text>
      <Text style={styles.sectionTitle}>Travel Stats</Text>
    </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>28</Text>
          <Text style={styles.statLabel}>Cities</Text>
        </View>

       
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
    backgroundColor: "#f8fafc",
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
    color: "#7f1d1d",
  },
  errorText: {
    fontSize: 14,
    color: "#dc2626",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#ef4444",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#fecaca",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  leftBorder: {
    width: 4,
    backgroundColor: "#ef4444",
    borderRadius: 4,
    marginRight: 12,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    color: "#b91c1c",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: "#7f1d1d",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f1d1d",
  },
  tripCard: {
    marginTop: 8,
  },
  tripLocation: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7f1d1d",
  },
  tripSubtitle: {
    fontSize: 13,
    color: "#b91c1c",
    marginTop: 4,
  },
  tripDate: {
    fontSize: 12,
    color: "#dc2626",
    marginTop: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f1d1d",
  },

  statsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 4,
},

statBox: {
  flex: 1,
  alignItems: "center",
},

statNumber: {
  fontSize: 26,
  fontWeight: "700",
  color: "#dc2626",
},

statLabel: {
  fontSize: 12,
  color: "#b91c1c",
  marginTop: 4,
},

});