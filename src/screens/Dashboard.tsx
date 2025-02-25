import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";
import { getExpensesInRange } from "../database/ExpensesDB";
import { getTripsByIds } from "../database/TripsDB";

const Dashboard = () => {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [isStartDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [trips, setTrips] = useState<any[]>([]); // Stores full trip details
  const [tripSpending, setTripSpending] = useState<{ [key: number]: number }>({}); // Stores total spending per trip

  // Load expenses when dates change
  useEffect(() => {
    fetchExpensesAndTrips();
  }, [startDate, endDate]);

  const fetchExpensesAndTrips = async () => {
    const expenseList = await getExpensesInRange(startDate, endDate);
    setExpenses(expenseList);

    // Compute total expenses for all trips combined
    const total = expenseList.reduce((sum, expense) => sum + parseFloat(expense.expenseAmount), 0);
    setTotalExpenses(total);

    // Extract unique tripIds
    const uniqueTripIds = Array.from(new Set(expenseList.map((expense) => expense.tripId)));

    if (uniqueTripIds.length > 0) {
      const tripsList = await getTripsByIds(uniqueTripIds);
      setTrips(tripsList);

      // Calculate total spending per trip
      const spendingMap: { [key: number]: number } = {};
      expenseList.forEach((expense) => {
        if (!spendingMap[expense.tripId]) {
          spendingMap[expense.tripId] = 0;
        }
        spendingMap[expense.tripId] += parseFloat(expense.expenseAmount);
      });

      setTripSpending(spendingMap);
    } else {
      setTrips([]);
      setTripSpending({});
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

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

      {/* Display Total Expenses */}
      <Text style={styles.totalExpenses}>Total Spent: ${totalExpenses.toFixed(2)}</Text>

      {/* Display Unique Trips */}
      <Text style={styles.subtitle}>Trips in this period:</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.tripId.toString()}
        renderItem={({ item }) => (
          <View style={styles.tripItem}>
            <Text style={styles.tripText}>
              {item.tripName} (Created: {item.tripDateCreated.split("T")[0]})
            </Text>
            <Text style={styles.tripExpense}>
              Total Spent: ${tripSpending[item.tripId]?.toFixed(2) || "0.00"}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
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
  totalExpenses: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
  },
  tripItem: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    marginBottom: 8,
  },
  tripText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tripExpense: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "600",
    marginTop: 5,
  },
  expenseItem: {
    padding: 10,
    backgroundColor: "#e8e8e8",
    borderRadius: 5,
    marginBottom: 8,
  },
});
