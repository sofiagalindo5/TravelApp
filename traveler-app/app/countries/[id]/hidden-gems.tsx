import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { API_BASE_URL } from "../../../constants/api";

type HiddenGem = {
  id: number;
  name: string;
  location?: string;
  description?: string;
  link?: string;
};

export default function HiddenGemsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [gems, setGems] = useState<HiddenGem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHiddenGems() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/${id}/`);
        const data = await response.json();

        if (data.hidden_gems) {
          setGems(data.hidden_gems);
        } else {
          setGems([]);
        }
      } catch (error) {
        console.log("Error loading hidden gems:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadHiddenGems();
    }
  }, [id]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.header}>Hidden Gems</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : gems.length > 0 ? (
          gems.map((gem) => (
            <View key={gem.id} style={styles.card}>
              <Text style={styles.gemName}>{gem.name}</Text>

              {gem.location ? (
                <Text style={styles.location}>{gem.location}</Text>
              ) : null}

              {gem.description ? (
                <Text style={styles.description}>{gem.description}</Text>
              ) : null}

              {gem.link ? <Text style={styles.link}>{gem.link}</Text> : null}
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No hidden gems available yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff5f5",
  },

  page: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#7f1d1d",
    marginBottom: 20,
  },

  center: {
    alignItems: "center",
    marginTop: 40,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  gemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7f1d1d",
    marginBottom: 4,
  },

  location: {
    fontSize: 14,
    color: "#b91c1c",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "#991b1b",
    lineHeight: 20,
  },

  link: {
    marginTop: 8,
    fontSize: 13,
    color: "#dc2626",
  },

  empty: {
    marginTop: 20,
    fontSize: 16,
    color: "#991b1b",
  },
});