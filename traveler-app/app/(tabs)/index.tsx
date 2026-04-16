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

import { API_BASE_URL } from "../../constants/api";

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
    router.push({
    pathname: "/countries/[id]",
    params: { id: country.id, name: country.name },
});
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
    backgroundColor: "#f4efe6", // soft cream
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
    fontSize: 30,
    fontWeight: "700",
    color: "#5a1e2c", // maroon
  },

  loadingWrap: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    color: "#7a2d3f",
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5a1e2c",
    marginBottom: 10,
    paddingHorizontal: 24,
  },

  row: {
    paddingHorizontal: 24,
    paddingBottom: 4,
    gap: 14,
  },

  card: {
    width: 140,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#8d1035ff", // clean card instead of red
    justifyContent: "flex-end",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  cardOverlay: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(161, 100, 114, 0.33)", // maroon overlay
  },

  cityText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  countryText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: 2,
  },

  comingSoonCard: {
    width: 180,
    height: 160,
    borderRadius: 16,
    backgroundColor: "#e9dfcc",
    padding: 14,
    justifyContent: "center",
  },

  comingSoonTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5a1e2c",
    marginBottom: 6,
  },

  comingSoonText: {
    fontSize: 12,
    color: "#7a2d3f",
    lineHeight: 18,
  },
});