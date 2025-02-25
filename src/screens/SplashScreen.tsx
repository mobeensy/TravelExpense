import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Main");
    }, 3000); // Navigate after 3 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [navigation]);

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.replace("TripPlanner")}>
      <Text style={styles.title}>TravelExpense</Text>
      <Text style={styles.subtitle}>The simplest way to capture your expenses</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginBottom: 40,
  },
});

export default SplashScreen;
