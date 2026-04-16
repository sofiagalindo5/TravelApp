import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { API_BASE_URL } from "../../../constants/api";

type Interview = {
  id: number;
  person_name: string;
  title_or_role?: string;
  quote: string;
  full_story?: string;
};

export default function InterviewsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInterviews() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/${id}/`);
        const data = await response.json();

        if (data.personal_interviews) {
          setInterviews(data.personal_interviews);
        } else {
          setInterviews([]);
        }
      } catch (error) {
        console.log("Error loading interviews:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadInterviews();
  }, [id]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.header}>Personal Interviews</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : interviews.length > 0 ? (
          interviews.map((interview) => (
            <View key={interview.id} style={styles.block}>
              <Text style={styles.name}>
                {interview.person_name}
                {interview.title_or_role
                  ? ` (${interview.title_or_role})`
                  : ""}
              </Text>

              <Text style={styles.quote}>
                "{interview.quote}"
              </Text>

              {interview.full_story ? (
                <Text style={styles.story}>
                  {interview.full_story}
                </Text>
              ) : null}
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No interviews available yet.</Text>
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

  block: {
    marginBottom: 24,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7f1d1d",
    marginBottom: 8,
  },

  quote: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#991b1b",
    marginBottom: 10,
    lineHeight: 22,
  },

  story: {
    fontSize: 14,
    color: "#991b1b",
    lineHeight: 20,
  },

  empty: {
    fontSize: 16,
    color: "#991b1b",
  },
});