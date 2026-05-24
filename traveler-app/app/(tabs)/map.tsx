import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../constants/api";

type VisitedCountry = {
  id: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
};

export default function MapScreen() {
  const [visitedCountries, setVisitedCountries] = useState<VisitedCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitedCountries();
  }, []);

  const fetchVisitedCountries = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setVisitedCountries(data.profile?.visited_countries || []);
    } catch (error) {
      console.log("Map fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5a1e2c" />
      </View>
    );
  }

  const mappable = visitedCountries.filter(
    (c) => c.latitude != null && c.longitude != null
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 15,
          longitude: -70,
          latitudeDelta: 70,
          longitudeDelta: 70,
        }}
      >
        {mappable.map((country) => (
          <Marker
            key={country.id}
            coordinate={{
              latitude: country.latitude!,
              longitude: country.longitude!,
            }}
            title={country.name}
          >
            <Text style={styles.heartMarker}>❤️</Text>
          </Marker>
        ))}
      </MapView>
      <View style={styles.pill}>
        <Text style={styles.pillText}>❤️  hearts mark the countries you've visited</Text>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  heartMarker: { fontSize: 28 },

  pill: {
  position: "absolute",
  bottom: 36,
  alignSelf: "center",
  backgroundColor: "rgba(255, 249, 235, 0.92)",
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 100,
  shadowColor: "#3b1018",
  shadowOpacity: 0.15,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
  borderWidth: 1,
  borderColor: "rgba(90, 30, 44, 0.12)",
},
pillText: {
  fontSize: 13,
  color: "#5a1e2c",
  fontWeight: "600",
  letterSpacing: 0.2,
},
});