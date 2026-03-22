import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

type Country = {
  id: number;
  name: string;
  hero_image_url?: string;
  short_description?: string;
};

export default function HomeScreen() {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(function () {
    async function loadCountries() {
      try {
        const response = await fetch("http://10.0.48.145:8000/api/countries/");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.log("Error loading countries:", error);
      }
    }

    loadCountries();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Planning a trip?</Text>

        <Section title="Trending" countries={countries} />
        <Section title="Spring Break" countries={countries} />
        <Section title="Thanksgiving" countries={countries} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  countries,
}: {
  title: string;
  countries: Country[];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {countries.map(function (country) {
          return <CountryCard key={country.id} country={country} />;
        })}
      </ScrollView>
    </View>
  );
}

function CountryCard({ country }: { country: Country }) {
  function handlePress() {
    Alert.alert("Selected country", country.name);
  }

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>🌍</Text>
      </View>

      <Text style={styles.cardText}>{country.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f59999",
  },

  page: {
    padding: 16,
    paddingBottom: 32,
    gap: 18,
  },

  header: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 6,
  },

  section: {
    gap: 10,
  },

  sectionTitle: {
    color: "#e5e7eb",
    fontSize: 18,
    fontWeight: "700",
  },

  row: {
    gap: 12,
    paddingRight: 8,
  },

  card: {
    width: 120,
    height: 140,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 12,
    justifyContent: "space-between",
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    fontSize: 20,
  },

  cardText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
