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
import { useRouter } from "expo-router";

const API_BASE_URL = "http://192.168.4.211:8000";

type Country = {
  id: number;
  name: string;
  hero_image_url?: string | null;
  short_description?: string | null;
  season_tag?: string | null;
  city?: string | null;
};

type SectionProps = {
  title: string;
  countries: Country[];
};

type CountryCardProps = {
  country: Country;
};

function CountryCard({ country }: CountryCardProps) {
  const router = useRouter();

  function handlePress() {
    router.push(`/countries/${country.id}`);
  }

  const displayCity = country.city || country.name;
  const displayCountry = country.name;

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.cardOverlay}>
        <Text style={styles.cityText} numberOfLines={1}>
          {displayCity}
        </Text>
        <Text style={styles.countryText} numberOfLines={1}>
          {displayCountry}
        </Text>
      </View>
    </Pressable>
  );
}

function Section({ title, countries }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {countries.length > 0 ? (
          countries.map((country) => (
            <CountryCard key={country.id} country={country} />
          ))
        ) : (
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonTitle}>Coming soon</Text>
            <Text style={styles.comingSoonText}>
              Destinations for this section are being added.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default function IndexScreen() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCountries() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/countries/`);
        const data = await response.json();

        console.log("Fetched countries:", data);

        if (Array.isArray(data)) {
          setCountries(data);
        } else if (Array.isArray(data.results)) {
          setCountries(data.results);
        } else {
          setCountries([]);
        }
      } catch (error) {
        console.log("Error loading countries:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCountries();
  }, []);

  const springBreakCountries = countries;
  const thanksgivingCountries = countries;
  const newYearsCountries = countries;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrap}>
          <Text style={styles.header}>Planning a Trip?</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading destinations...</Text>
          </View>
        ) : (
          <>
            <Section title="Spring Break" countries={springBreakCountries} />
            <Section title="Thanksgiving" countries={thanksgivingCountries} />
            <Section title="New Years" countries={newYearsCountries} />
          </>
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
    paddingBottom: 32,
  },

  headerWrap: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },

  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#7f1d1d",
  },

  loadingWrap: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 16,
    color: "#7f1d1d",
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#7f1d1d",
    marginBottom: 12,
    paddingHorizontal: 24,
  },

  row: {
    paddingHorizontal: 24,
    paddingBottom: 4,
    gap: 12,
  },

  card: {
    width: 140,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ef4444",
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  cardOverlay: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  cityText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  countryText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginTop: 2,
  },

  comingSoonCard: {
    width: 180,
    height: 160,
    borderRadius: 16,
    backgroundColor: "#fecaca",
    padding: 14,
    justifyContent: "center",
  },

  comingSoonTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7f1d1d",
    marginBottom: 6,
  },

  comingSoonText: {
    fontSize: 13,
    color: "#991b1b",
    lineHeight: 18,
  },
});