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
import { useLocalSearchParams, useRouter } from "expo-router";

const API_BASE_URL = "http://192.168.4.211:8000";

type HotelItem = {
  id: number;
  name: string;
  city?: string;
  notes?: string;
};

type TipItem = {
  id: number;
  text: string;
};

type GemItem = {
  id: number;
  name: string;
  description?: string;
};

type ItineraryItem = {
  id: number;
  title?: string;
  content?: string;
};

type InterviewItem = {
  id: number;
  quote?: string;
  content?: string;
  person_name?: string;
};

type CountryDetail = {
  id: number;
  name: string;
  city?: string | null;
  short_description?: string | null;
  hotels?: HotelItem[];
  safety_tips?: TipItem[];
  hidden_gems?: GemItem[];
  pro_tips?: TipItem[];
  itinerary_days?: ItineraryItem[];
  personal_interview?: InterviewItem | null;
};

type InfoCardProps = {
  title: string;
  icon: string;
  content: string;
};

function InfoCard({ title, icon, content }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <Text style={styles.infoIcon}>{icon}</Text>
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Text style={styles.infoContent}>{content}</Text>
    </View>
  );
}

export default function CountryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCountryDetail() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/${id}/`);
        const data = await response.json();

        console.log("Fetched country detail:", data);

        setCountry(data);
      } catch (error) {
        console.log("Error loading country detail:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadCountryDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading destination...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!country) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Destination not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hotelContent =
    country.hotels && country.hotels.length > 0
      ? country.hotels
          .map((hotel) => `${hotel.name}${hotel.city ? ` - ${hotel.city}` : ""}`)
          .join("\n")
      : "Coming soon";

  const safetyContent =
    country.safety_tips && country.safety_tips.length > 0
      ? country.safety_tips.map((tip) => tip.text).join("\n")
      : "Coming soon";

  const itineraryContent =
    country.itinerary_days && country.itinerary_days.length > 0
      ? country.itinerary_days
          .map((item) => item.title || item.content || "Itinerary item")
          .join("\n")
      : "Coming soon";

  const interviewContent = country.personal_interview
    ? country.personal_interview.quote ||
      country.personal_interview.content ||
      "Interview available soon"
    : "Coming soon";

  const gemsContent =
    country.hidden_gems && country.hidden_gems.length > 0
      ? country.hidden_gems
          .map((gem) => gem.name || gem.description || "Hidden gem")
          .join("\n")
      : "Coming soon";

  const proTipsContent =
    country.pro_tips && country.pro_tips.length > 0
      ? country.pro_tips.map((tip) => tip.text).join("\n")
      : "Coming soon";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>‹ Back</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            {country.city || country.name}
          </Text>
          <Text style={styles.headerSubtitle}>{country.name}</Text>
        </View>

        <View style={styles.grid}>
          <InfoCard title="Hotel" icon="🏨" content={hotelContent} />
          <InfoCard title="Safety Tips" icon="🛡️" content={safetyContent} />
          <InfoCard
            title="Weekend Itinerary"
            icon="🗓️"
            content={itineraryContent}
          />
          <InfoCard
            title="Personal Interview"
            icon="💬"
            content={interviewContent}
          />
          <InfoCard title="Hidden Gems" icon="📍" content={gemsContent} />
          <InfoCard title="Pro-Tips" icon="💡" content={proTipsContent} />
        </View>
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
    paddingBottom: 24,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
  },

  loadingText: {
    color: "#7f1d1d",
    fontSize: 16,
  },

  notFoundText: {
    color: "#7f1d1d",
    fontSize: 18,
    fontWeight: "600",
  },

  headerBlock: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    marginBottom: 12,
    backgroundColor: "#fee2e2",
  },

  backButton: {
    marginBottom: 12,
    alignSelf: "flex-start",
    paddingVertical: 6,
  },

  backButtonText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },

  headerTitle: {
    color: "#7f1d1d",
    fontSize: 28,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "#b91c1c",
    fontSize: 15,
    marginTop: 4,
  },

  grid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  infoCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#ef4444",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    minHeight: 150,
  },

  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },

  infoIcon: {
    fontSize: 18,
  },

  infoTitle: {
    color: "#7f1d1d",
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },

  infoContent: {
    color: "#991b1b",
    fontSize: 12,
    lineHeight: 18,
  },
});