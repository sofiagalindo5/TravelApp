import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../constants/api";

type UserResult = {
  id: number;
  username: string;
  display_name?: string;
  visited_count: number;
  upcoming_trip: {
    country: { id: number; name: string };
    trip_date: string;
  } | null;
};

export default function FriendsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (searchText: string) => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) { setUsers([]); return; }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/users/search/?q=${encodeURIComponent(searchText)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (!response.ok) { setUsers([]); return; }
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { searchUsers(""); }, []);

  useEffect(() => {
    const timeout = setTimeout(() => searchUsers(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const renderItem = ({ item }: { item: UserResult }) => {
    // Use display_name if set, otherwise fall back to username (no @ prefix)
    const displayName = item.display_name?.trim() || item.username;
    const initial = displayName.charAt(0).toUpperCase();

    return (
      <Pressable style={styles.card} onPress={() => router.push(`/friends/${item.id}`)}>
        <View style={styles.cardAccent} />
        <View style={styles.cardBody}>
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.username}>{displayName}</Text>
            <Text style={styles.handle}>@{item.username}</Text>
            <View style={styles.divider} />
            <Text style={styles.tripLabel}>✈️ Upcoming trip</Text>
            <Text style={styles.tripValue}>
              {item.upcoming_trip
                ? `${item.upcoming_trip.country.name} · ${item.upcoming_trip.trip_date}`
                : "No trip planned yet"}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <Text style={styles.subtitle}>See where everyone is going next</Text>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search travelers..."
          placeholderTextColor="#c4a8a8"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color="#5a1e2c" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🧭</Text>
              <Text style={styles.emptyText}>No travelers found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4efe6",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#3b1018",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#9e6b6b",
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  searchRow: {
    marginBottom: 18,
  },
  searchInput: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "#e8d5be",
    color: "#3b1018",
    shadowColor: "#3b1018",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginBottom: 14,
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
  username: { fontSize: 16, fontWeight: "700", color: "#3b1018", marginBottom: 2 },
  handle: { fontSize: 12, color: "#9e6b6b", marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#f5ede0", marginBottom: 10 },
  tripLabel: { fontSize: 12, fontWeight: "600", color: "#9e6b6b", marginBottom: 3, letterSpacing: 0.2 },
  tripValue: { fontSize: 14, color: "#5a1e2c", fontWeight: "600" },
  emptyBox: { marginTop: 60, alignItems: "center", gap: 12 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 15, color: "#9e6b6b", textAlign: "center" },
});