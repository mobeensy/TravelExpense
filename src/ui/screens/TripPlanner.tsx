import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { insertTrip, getTrips } from "../../database/TripsDB"; // <-- import your DB methods

type RootStackParamList = {
  TripPlanner: undefined;
  TripDetails: { tripId: number; tripName: string };
};

type TripPlannerNavProp = NativeStackNavigationProp<RootStackParamList, "TripPlanner">;

interface TripRow {
  tripId: number;
  tripName: string;
  tripDateCreated: string;
  tripLastModified: string;
}

const TripPlanner = () => {
  const navigation = useNavigation<TripPlannerNavProp>();

  const [newTripText, setNewTripText] = useState("");
  const [trips, setTrips] = useState<TripRow[]>([]);

  // Load existing trips on mount
  useEffect(() => {
    loadTripsFromDB();
  }, []);

  const loadTripsFromDB = async () => {
    try {
      const allTrips = await getTrips();
      console.log("✅ Loaded trips from DB:", allTrips); // Debugging log
      setTrips(allTrips as TripRow[]);
    } catch (error) {
      console.error("❌ Error loading trips:", error);
    }
  };

  const handleAddTrip = async () => {
    if (newTripText.trim() === "") return;

    try {
      // Insert the trip, get its new ID
      const insertedTripId = await insertTrip(newTripText.trim());
      // Navigate to TripDetails
      navigation.navigate("TripDetails", {
        tripId: insertedTripId,
        tripName: newTripText.trim(),
      });

      // Reset the input
      setNewTripText("");
      // Optionally refresh the trip list (if you still want to show them here)
      await loadTripsFromDB();
    } catch (error) {
      console.error("❌ handleAddTrip error:", error);
    }
  };

  // Navigate to an existing trip
  const handleTripPress = (trip: TripRow) => {
    navigation.navigate("TripDetails", {
      tripId: trip.tripId,
      tripName: trip.tripName,
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
        keyExtractor={(item) => (item.tripId ? item.tripId.toString() : Math.random().toString())}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.tripItem} onPress={() => handleTripPress(item)}>
            <Text style={styles.tripText}>
              {item.tripName} (Created: {new Date(item.tripDateCreated).toLocaleDateString()})
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TripPlanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
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
  },
  tripText: {
    fontSize: 16,
  },
});
