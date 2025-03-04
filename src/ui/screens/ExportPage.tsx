import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import DatePicker from "react-native-date-picker";
import { getTripsInRange } from "../../database/TripsDB";
import { getExpensesByTrip } from "../../database/ExpensesDB";
import { generateCSV } from "../../utils/GenerateCSV";
import { sendCSVByEmail } from "../../utils/SendEmail";

const ExportPage = () => {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [isStartDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [startDate, endDate]);

  const fetchTrips = async () => {
    const tripList = await getTripsInRange(startDate, endDate);
    setTrips(tripList);
    setSelectedTrips([]); // Reset selection when date changes
    setSelectAll(false);
  };

  const toggleSelectTrip = (tripId: number) => {
    setSelectedTrips(
      (prevSelected) =>
        prevSelected.includes(tripId)
          ? prevSelected.filter((id) => id !== tripId) // Remove if already selected
          : [...prevSelected, tripId], // Add if not selected
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTrips([]); // Unselect all
    } else {
      setSelectedTrips(trips.map((trip) => trip.tripId)); // Select all
    }
    setSelectAll(!selectAll);
  };

  const handleExport = async () => {
    if (selectedTrips.length === 0) {
      console.log("❌ No trips selected for export.");
      return;
    }

    let allExpenses: Expense[] = [];
    for (const tripId of selectedTrips) {
      const expenses = await getExpensesByTrip(tripId);
      allExpenses = expenses.map((row: any) => ({
        expenseId: row.expenseId,
        expenseCategory: row.expenseCategory,
        expenseLocation: row.expenseLocation,
        expenseAmount: String(row.expenseAmount),
        expenseDate: row.expenseDate,
        expenseCurrency: row.expenseCurrency,
        expenseDetails: row.expenseDetail,
      }));
      allExpenses = [...allExpenses, ...expenses];
    }

    if (allExpenses.length === 0) {
      console.log("❌ No expenses found for selected trips.");
      return;
    }

    // Use the first trip name (assuming one trip per export for file naming)
    const firstTrip = trips.find((trip) => trip.tripId === selectedTrips[0]);
    const tripName = firstTrip ? firstTrip.tripName.replace(/\s+/g, "_") : "Trip";

    const filePath = await generateCSV(allExpenses, tripName);
    if (filePath) {
      await sendCSVByEmail(filePath);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Export Trips</Text>

      {/* Date Pickers */}
      <View style={styles.datePickerRow}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setStartDatePickerOpen(true)}
        >
          <Text>Start Date: {startDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setEndDatePickerOpen(true)}
        >
          <Text>End Date: {endDate}</Text>
        </TouchableOpacity>
      </View>

      <DatePicker
        modal
        open={isStartDatePickerOpen}
        date={new Date(startDate)}
        mode="date"
        onConfirm={(date) => {
          setStartDatePickerOpen(false);
          setStartDate(date.toISOString().split("T")[0]);
        }}
        onCancel={() => setStartDatePickerOpen(false)}
      />

      <DatePicker
        modal
        open={isEndDatePickerOpen}
        date={new Date(endDate)}
        mode="date"
        onConfirm={(date) => {
          setEndDatePickerOpen(false);
          setEndDate(date.toISOString().split("T")[0]);
        }}
        onCancel={() => setEndDatePickerOpen(false)}
      />

      {/* No Trips Found Message */}
      {trips.length === 0 ? (
        <Text style={styles.noTripsText}>No trips found in this date range.</Text>
      ) : (
        <>
          {/* Select All Option */}
          <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
            <Text style={styles.selectAllText}>{selectAll ? "Unselect All" : "Select All"}</Text>
          </TouchableOpacity>

          {/* Trip Selection List */}
          <FlatList
            data={trips}
            keyExtractor={(item) => item.tripId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.tripItem}
                onPress={() => toggleSelectTrip(item.tripId)}
              >
                <Text style={styles.tripText}>
                  {selectedTrips.includes(item.tripId) ? "✔ " : "○ "} {item.tripName} (
                  {item.tripDateCreated.split("T")[0]})
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Export Button */}
          <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Text style={styles.exportButtonText}>Export & Email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ExportPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  noTripsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  selectAllButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  selectAllText: {
    color: "white",
    fontWeight: "bold",
  },
  tripItem: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    marginBottom: 8,
  },
  tripText: {
    fontSize: 16,
  },
  exportButton: {
    padding: 15,
    backgroundColor: "#28a745",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  exportButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// const ExportPage = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Export Trips</Text>
//     </View>
//   );
// };

// export default ExportPage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
// });
