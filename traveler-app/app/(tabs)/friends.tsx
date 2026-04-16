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
    country: {
      id: number;
      name: string;
    };
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
      if (!token) {
        console.log("No access token found");
        setUsers([]);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/users/search/?q=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Search users response:", data);

      if (!response.ok) {
        console.log("Search failed:", data);
        setUsers([]);
        return;
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Search users error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchUsers("");
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchUsers(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const renderItem = ({ item }: { item: UserResult }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/friends/${item.id}`)}
    >
      <Text style={styles.username}>
        {item.display_name?.trim() ? item.display_name : `@${item.username}`}
      </Text>

      <Text style={styles.handle}>@{item.username}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.statLabel}>Visited</Text>
        <Text style={styles.statValue}>{item.visited_count}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.tripLabel}>Upcoming trip</Text>
      <Text style={styles.tripValue}>
        {item.upcoming_trip
          ? `${item.upcoming_trip.country.name} • ${item.upcoming_trip.trip_date}`
          : "No trip planned"}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <Text style={styles.subtitle}>See where everyone is going next</Text>

      <TextInput
        placeholder="Search users"
        placeholderTextColor="#8b7b7b"
        value={query}
        onChangeText={setQuery}
        style={styles.searchInput}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} color="#5a1e2c" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found.</Text>
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
    fontWeight: "700",
    marginBottom: 4,
    color: "#5a1e2c",
  },

  subtitle: {
    fontSize: 14,
    color: "#7a2d3f",
    marginBottom: 18,
  },

  searchInput: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#d8c7a1",
    color: "#3b2a2a",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  username: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
    color: "#5a1e2c",
  },

  handle: {
    fontSize: 13,
    color: "#7a2d3f",
    marginBottom: 12,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statLabel: {
    fontSize: 14,
    color: "#7a2d3f",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5a1e2c",
  },

  divider: {
    height: 1,
    backgroundColor: "#eadfce",
    marginVertical: 12,
  },

  tripLabel: {
    fontSize: 13,
    color: "#7a2d3f",
    marginBottom: 4,
  },

  tripValue: {
    fontSize: 14,
    color: "#3b2a2a",
    fontWeight: "500",
  },

  emptyText: {
    marginTop: 24,
    fontSize: 15,
    color: "#8b7b7b",
  },
});