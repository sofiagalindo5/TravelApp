import React from "react";
import { SafeAreaView, ScrollView, Text, View, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Planning a trip?</Text>

        <Section title="Trending" />
        <Section title="Spring Break" />
        <Section title="Thanksgiving" />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title }: { title: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {/* cards go here */}
        {["Bolivia", "Japan", "Spain", "USA"].map((name) => (
        <View key={name} style={styles.card}>
        <View style={styles.icon} />
        <Text style={styles.cardText}>{name}</Text>
        </View>
    ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f59999ff" },
  page: { padding: 16, paddingBottom: 32, gap: 18 },
  header: { color: "white", fontSize: 28, fontWeight: "700", marginTop: 6 },

  section: { gap: 10 },
  sectionTitle: { color: "#e5e7eb", fontSize: 18, fontWeight: "700" },
  row: { gap: 12, paddingRight: 8 },

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

cardText: { color: "#fff", fontWeight: "700" },
});
