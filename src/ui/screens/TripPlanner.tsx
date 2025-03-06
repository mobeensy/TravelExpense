import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { insertTrip, getTrips } from "../../database/TripsDB";

type RootStackParamList = {
  TripPlanner: undefined;
  TripDetails: { tripId: number; tripName: string; tripCurrency: string | null };
};

type TripPlannerNavProp = NativeStackNavigationProp<RootStackParamList, "TripPlanner">;

interface TripRow {
  tripId: number;
  tripName: string;
  tripLastUsedCurrency: string | null;
  tripDateCreated: string;
  tripLastModified: string;
}

const TripPlanner = () => {
  const navigation = useNavigation<TripPlannerNavProp>();
  const [newTripText, setNewTripText] = useState("");
  const [trips, setTrips] = useState<TripRow[]>([]);

  // Function to load trips from DB
  const loadTripsFromDB = async () => {
    try {
      const allTrips = await getTrips();
      setTrips(allTrips as TripRow[]);
    } catch (error) {
      console.error("❌ Error loading trips:", error);
    }
  };

  // ✅ Reload trips when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadTripsFromDB();
    }, []),
  );

  const handleAddTrip = async () => {
    if (newTripText.trim() === "") return;

    try {
      const insertedTripId = await insertTrip(newTripText.trim());
      navigation.navigate("TripDetails", {
        tripId: insertedTripId,
        tripName: newTripText.trim(),
        tripCurrency: null,
      });

      setNewTripText("");
      await loadTripsFromDB();
    } catch (error) {
      console.error("❌ handleAddTrip error:", error);
    }
  };

  const handleTripPress = (trip: TripRow) => {
    navigation.navigate("TripDetails", {
      tripId: trip.tripId,
      tripName: trip.tripName,
      tripCurrency: trip.tripLastUsedCurrency,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Planner</Text>

      {/* Input for new trip */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter new Trip Name"
          value={newTripText}
          onChangeText={setNewTripText}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTrip}>
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Display list of existing trips */}
      <FlatList
        data={trips}
        keyExtractor={(item) => item.tripId.toString()}
        renderItem={({ item }) => {
          // Format the date to show only year-month-day
          const formattedDate = item.tripDateCreated
            ? new Date(item.tripDateCreated).toISOString().split("T")[0]
            : "N/A";

          return (
            <TouchableOpacity style={styles.tripItem} onPress={() => handleTripPress(item)}>
              <Text style={styles.tripText}>{item.tripName}</Text>
              <Text style={styles.tripText}>({formattedDate})</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default TripPlanner;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  searchContainer: { flexDirection: "row", marginBottom: 16, alignItems: "center" },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 8,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    width: 60,
    height: 60,
    alignSelf: "center",
    marginBottom: 16,
  },
  tripItem: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    marginBottom: 8,
    flexDirection: "row", // You need this to make justifyContent work
    justifyContent: "space-between", // Correct property for spacing items
  },
  tripText: { fontSize: 16 },
});
