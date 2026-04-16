import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../constants/api";

type SectionCardProps = {
  title: string;
  icon: string;
  subtitle: string;
  onPress: () => void;
};

type CountryDetail = {
  id: number;
  name: string;
  short_description?: string;
  is_visited?: boolean;
};

function SectionCard({ title, icon, subtitle, onPress }: SectionCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

export default function CountryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const name = Array.isArray(params.name) ? params.name[0] : params.name;

  const [tripDate, setTripDate] = useState("");
  const [settingTrip, setSettingTrip] = useState(false);
  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingVisited, setMarkingVisited] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchCountryDetail();
    }
  }, [id]);

  const fetchCountryDetail = async () => {
    try {
      setLoading(true);
      setError("");

      let accessToken = await SecureStore.getItemAsync("accessToken");

      if (!accessToken) {
        setError("No access token found. Please log in again.");
        return;
      }

      let response = await fetch(`${API_BASE_URL}/api/countries/${id}/`, {
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

        response = await fetch(`${API_BASE_URL}/api/countries/${id}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      const text = await response.text();
      console.log("country detail raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server returned non-JSON response: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data?.detail ?? "Could not load country");
      }

      setCountry(data);
    } catch (err: any) {
      console.log("fetchCountryDetail error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkVisited = async () => {
    if (!id || country?.is_visited) return;

    try {
      setMarkingVisited(true);
      setError("");

      let accessToken = await SecureStore.getItemAsync("accessToken");

      if (!accessToken) {
        setError("No access token found. Please log in again.");
        return;
      }

      let response = await fetch(`${API_BASE_URL}/api/auth/profile/visited/${id}/`, {
        method: "POST",
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

        response = await fetch(`${API_BASE_URL}/api/auth/profile/visited/${id}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      const text = await response.text();
      console.log("mark visited raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server returned non-JSON response: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data?.detail ?? "Could not mark country as visited");
      }

      setCountry((prev) =>
        prev
          ? {
              ...prev,
              is_visited: true,
            }
          : prev
      );
    } catch (err: any) {
      console.log("handleMarkVisited error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setMarkingVisited(false);
    }
  };

  const handleRSVP = async () => {
    if (!id || !tripDate) {
      setError("Please enter a date (YYYY-MM-DD)");
      return;
    }

    try {
      setSettingTrip(true);
      setError("");

      let accessToken = await SecureStore.getItemAsync("accessToken");

      if (!accessToken) {
        setError("No access token found. Please log in again.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/profile/upcoming-trip/${id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trip_date: tripDate,
          }),
        }
      );

      const text = await response.text();
      console.log("RSVP raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server returned non-JSON response: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data?.detail ?? "Could not set trip");
      }

      alert("Trip saved!");
    } catch (err: any) {
      console.log("handleRSVP error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSettingTrip(false);
    }
  };

  const countryName = country?.name || name || "Destination";

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading destination...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.page}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerBlock}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>‹ Back</Text>
            </Pressable>

            <Text style={styles.headerTitle}>{countryName}</Text>
            <Text style={styles.headerSubtitle}>
              Explore travel details by section
            </Text>

            <View style={styles.visitedWrapper}>
              {country?.is_visited ? (
                <View style={styles.visitedBadge}>
                  <Text style={styles.visitedBadgeText}>✓ Visited</Text>
                </View>
              ) : (
                <Pressable
                  style={[
                    styles.visitedButton,
                    markingVisited && styles.visitedButtonDisabled,
                  ]}
                  onPress={handleMarkVisited}
                  disabled={markingVisited}
                >
                  <Text style={styles.visitedButtonText}>
                    {markingVisited ? "Marking..." : "Mark as Visited"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.rsvpWrapper}>
            <Text style={styles.rsvpTitle}>RSVP to this trip</Text>

            <Text style={styles.rsvpHint}>Enter date (YYYY-MM-DD)</Text>

            <TextInput
              style={styles.dateInput}
              value={tripDate}
              onChangeText={setTripDate}
              placeholder="2026-06-20"
              placeholderTextColor="#8b7b7b"
            />

            <Pressable
              style={[styles.rsvpButton, settingTrip && styles.visitedButtonDisabled]}
              onPress={handleRSVP}
              disabled={settingTrip}
            >
              <Text style={styles.rsvpButtonText}>
                {settingTrip ? "Saving..." : "RSVP to this Trip"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.grid}>
            <SectionCard
              title="Hotels"
              icon="🏨"
              subtitle="View recommended stays"
              onPress={() => router.push(`/countries/${id}/hotels`)}
            />

            <SectionCard
              title="Safety Tips"
              icon="🛡️"
              subtitle="View local safety advice"
              onPress={() => router.push(`/countries/${id}/safety-tips`)}
            />

            <SectionCard
              title="Weekend Itinerary"
              icon="🗓️"
              subtitle="View trip plan ideas"
              onPress={() => router.push(`/countries/${id}/itinerary`)}
            />

            <SectionCard
              title="Personal Interviews"
              icon="💬"
              subtitle="View local perspectives"
              onPress={() => router.push(`/countries/${id}/interviews`)}
            />

            <SectionCard
              title="Hidden Gems"
              icon="📍"
              subtitle="View unique places"
              onPress={() => router.push(`/countries/${id}/hidden-gems`)}
            />

            <SectionCard
              title="Pro-Tips"
              icon="💡"
              subtitle="View practical tips"
              onPress={() => router.push(`/countries/${id}/pro-tips`)}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f2e6ca8a",
  },

  page: {
    paddingTop: 28,
    paddingBottom: 28,
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

  headerBlock: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    marginBottom: 16,
  },

  backButton: {
    marginBottom: 14,
    alignSelf: "flex-start",
    paddingVertical: 6,
  },

  backButtonText: {
    color: "#5a1e2c",
    fontSize: 16,
    fontWeight: "600",
  },

  headerTitle: {
    color: "#8d1035ff",
    fontSize: 30,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "#7a2d3f",
    fontSize: 14,
    marginTop: 6,
  },

  visitedWrapper: {
    marginTop: 16,
  },

  visitedButton: {
    backgroundColor: "#8d1035ff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  visitedButtonDisabled: {
    opacity: 0.7,
  },

  visitedButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  visitedBadge: {
    backgroundColor: "#e9dfcc",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#d8c7a1",
  },

  visitedBadgeText: {
    color: "#8d1035ff",
    fontSize: 14,
    fontWeight: "700",
  },

  rsvpWrapper: {
    marginTop: 8,
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  rsvpTitle: {
    color: "#5a1e2c",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  rsvpHint: {
    fontSize: 12,
    color: "#7a2d3f",
    marginBottom: 8,
  },

  dateInput: {
    borderWidth: 1,
    borderColor: "#d8c7a1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#3b2a2a",
    marginBottom: 10,
    backgroundColor: "#f8f4ec",
  },

  rsvpButton: {
    backgroundColor: "#8d1035ff",
    padding: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  rsvpButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  grid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },

  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    minHeight: 120,
    justifyContent: "space-between",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  cardIcon: {
    fontSize: 20,
  },

  cardTitle: {
    color: "#5a1e2c",
    fontSize: 15,
    fontWeight: "700",
    flexShrink: 1,
  },

  cardSubtitle: {
    color: "#7a2d3f",
    fontSize: 13,
    lineHeight: 18,
  },
});