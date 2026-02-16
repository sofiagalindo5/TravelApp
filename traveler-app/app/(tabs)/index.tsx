
import { useEffect, useState } from "react";
import { healthCheck } from '@/lib/api';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  const [backendMsg, setBackendMsg] = useState("Checking backend...");

  useEffect(() => {
    healthCheck()
      .then((data) => setBackendMsg(`${data.status}: ${data.message}`))
      .catch((err) => setBackendMsg(`Backend error: ${String(err)}`));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One Updated</Text>
      <Text style={{ marginTop: 12 }}>{backendMsg}</Text>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
