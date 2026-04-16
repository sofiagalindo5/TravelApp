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

type ProTip = {
  id: number;
  title: string;
  description: string;
};

export default function ProTipsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [tips, setTips] = useState<ProTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProTips() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/${id}/`);
        const data = await response.json();

        if (data.pro_tips) {
          setTips(data.pro_tips);
        } else {
          setTips([]); 
        }
      } catch (error) {
        console.log("Error loading pro tips:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProTips();
    }
  }, [id]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.header}>Pro-Tips</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : tips.length > 0 ? (
          tips.map((tip) => (
            <View key={tip.id} style={styles.card}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.description}>{tip.description}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No pro-tips available yet.</Text>
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

  tipTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7f1d1d",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "#991b1b",
    lineHeight: 20,
  },

  empty: {
    marginTop: 20,
    fontSize: 16,
    color: "#991b1b",
  },
});