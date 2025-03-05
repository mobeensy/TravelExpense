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
import DatePicker from "react-native-date-picker";
import { RouteProp, useRoute } from "@react-navigation/native";
import { insertExpense, getExpensesByTrip } from "../../database/ExpensesDB";
import ExpenseItem from "../components/ExpensItem/ExpenseItem";
import TextInputField from "../components/TextInputField/TextInputField";
import { Picker } from "@react-native-picker/picker";
import CurrencyPicker from "../components/CurrencyPicker/CurrencyPicker";
import { updateTripCurrency } from "../../database/TripsDB";

type RootStackParamList = {
  TripDetails: {
    tripId: number;
    tripName: string;
    tripCurrency: string | null;
  };
};

type TripDetailsRouteProp = RouteProp<RootStackParamList, "TripDetails">;

const TripDetails = () => {
  const route = useRoute<TripDetailsRouteProp>();
  const { tripId, tripName, tripCurrency } = route.params;
  const [lastCurrency, setLastCurrency] = useState<string>(tripCurrency ? tripCurrency : "USD");
  // Expense Form
  const [formData, setFormData] = useState<Expense>({
    expenseCategory: "",
    expenseLocation: "",
    expenseAmount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    expenseCurrency: lastCurrency, // Default
    expenseDetails: "",
  });

  // List of expenses from the DB
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  // Load existing expenses when screen mounts
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const dbResults = await getExpensesByTrip(tripId);
    const expenseList: Expense[] = dbResults.map((row: any) => ({
      expenseId: row.expenseId,
      expenseCategory: row.expenseCategory,
      expenseLocation: row.expenseLocation,
      expenseAmount: String(row.expenseAmount),
      expenseDate: row.expenseDate,
      expenseCurrency: row.expenseCurrency,
      expenseDetails: row.expenseDetail,
    }));
    setExpenses(expenseList);
  };

  // Update form values
  const handleChangeText = (key: keyof Expense, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle numeric input for the amount field
  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters except "."
    let formatted = text.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point exists
    if (formatted.split(".").length > 2) {
      formatted = formatted.slice(0, formatted.lastIndexOf("."));
    }

    // Limit to two decimal places
    if (formatted.includes(".")) {
      const [whole, decimal] = formatted.split(".");
      formatted = whole + "." + (decimal.length > 2 ? decimal.slice(0, 2) : decimal);
    }

    setFormData((prev) => ({ ...prev, expenseAmount: formatted }));
  };

  const handleSubmit = async () => {
    if (
      formData.expenseCategory &&
      formData.expenseLocation &&
      formData.expenseAmount &&
      formData.expenseDate
    ) {
      await insertExpense(
        tripId,
        formData.expenseCategory,
        formData.expenseLocation,
        parseFloat(formData.expenseAmount),
        formData.expenseDate,
        formData.expenseDetails,
        formData.expenseCurrency,
      );

      await updateTripCurrency(tripId, formData.expenseCurrency);
      setLastCurrency(formData.expenseCurrency);

      await loadExpenses();

      setFormData((prev) => ({
        expenseCategory: "",
        expenseLocation: "",
        expenseAmount: "",
        expenseDate: new Date().toISOString().split("T")[0],
        expenseCurrency: prev.expenseCurrency, // Use `prev` to keep the previous value
        expenseDetails: "",
      }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tripName}</Text>

      {/* Expense Category */}
      <TextInputField
        placeholder="Expense Category"
        value={formData.expenseCategory}
        onChangeText={(text) => handleChangeText("expenseCategory", text)}
      />
      <View style={styles.locationRow}>
        <TextInputField
          style={{ flex: 1 }}
          placeholder="Location"
          value={formData.expenseLocation}
          onChangeText={(text) => handleChangeText("expenseLocation", text)}
        />
        <TouchableOpacity
          style={styles.datePickerContainer}
          onPress={() => setDatePickerOpen(true)}
        >
          <Text style={styles.datePickerText}>{formData.expenseDate}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TextInputField
          placeholder="Amount"
          keyboardType="numeric"
          value={formData.expenseAmount}
          onChangeText={handleAmountChange}
          style={{ flex: 1 }}
        />
        <CurrencyPicker
          selectedCurrency={formData.expenseCurrency}
          onSelect={(currency) => setFormData((prev) => ({ ...prev, expenseCurrency: currency }))}
        />
      </View>

      <DatePicker
        modal
        open={isDatePickerOpen}
        date={new Date(formData.expenseDate)}
        mode="date"
        onConfirm={(date) => {
          setDatePickerOpen(false);
          setFormData((prev) => ({
            ...prev,
            expenseDate: date.toISOString().split("T")[0],
          }));
        }}
        onCancel={() => setDatePickerOpen(false)}
      />
      <TextInputField
        placeholder="Details"
        value={formData.expenseDetails}
        onChangeText={(text) => handleChangeText("expenseDetails", text)}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Expense</Text>
      </TouchableOpacity>

      {/* List of Expenses */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.expenseId?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => (
          <ExpenseItem
            category={item.expenseCategory}
            location={item.expenseLocation}
            amount={item.expenseAmount}
            currency={item.expenseCurrency}
            date={item.expenseDate}
          />
        )}
      />
    </View>
  );
};

export default TripDetails;

const styles = StyleSheet.create({
  container: {
    gap: 4,
    flex: 1,
    backgroundColor: "#fff",
    // padding: 16,
    paddingHorizontal: 16,
  },
  title: {
    margin: 8,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  datePickerContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  datePickerText: {
    fontSize: 16,
    color: "#000",
  },
  itemContainer: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
  },
  row: {
    gap: 4,
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  locationRow: {
    gap: 4,
    flexDirection: "row",
  },
  submitButton: {
    backgroundColor: "#007BFF", // Primary blue color
    paddingVertical: 12,
    borderRadius: 25, // ✅ Makes it a pill shape
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
