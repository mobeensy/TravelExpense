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
import { insertExpense, getExpensesByTrip } from "../database/ExpensesDB";
import ExpenseItem from "../components/ExpensItem/ExpenseItem";
import TextInputField from "../components/TextInputField/TextInputField";

// Our DB schema uses these fields for expenses:
interface ExpenseItem {
  expenseId?: number;
  expenseCategory: string;
  expenseLocation: string;
  expenseAmount: string;
  expenseDate: string;
}

type RootStackParamList = {
  TripDetails: {
    tripId: number;
    tripName: string;
  };
};

type TripDetailsRouteProp = RouteProp<RootStackParamList, "TripDetails">;

const TripDetails = () => {
  const route = useRoute<TripDetailsRouteProp>();
  const { tripId, tripName } = route.params;

  // Expense Form
  const [formData, setFormData] = useState<ExpenseItem>({
    expenseCategory: "",
    expenseLocation: "",
    expenseAmount: "",
    expenseDate: new Date().toISOString().split("T")[0], // Default to today
  });

  // List of expenses from the DB
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  // Load existing expenses when screen mounts
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const dbResults = await getExpensesByTrip(tripId);
    const expenseList: ExpenseItem[] = dbResults.map((row: any) => ({
      expenseId: row.expenseId,
      expenseCategory: row.expenseCategory,
      expenseLocation: row.expenseLocation,
      expenseAmount: String(row.expenseAmount),
      expenseDate: row.expenseDate,
    }));
    setExpenses(expenseList);
  };

  // Update form values
  const handleChangeText = (key: keyof ExpenseItem, value: string) => {
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
        "",
      );

      await loadExpenses();

      setFormData({
        expenseCategory: "",
        expenseLocation: "",
        expenseAmount: "",
        expenseDate: new Date().toISOString().split("T")[0],
      });
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

      <TextInputField
        placeholder="Location"
        value={formData.expenseLocation}
        onChangeText={(text) => handleChangeText("expenseLocation", text)}
      />

      <TextInputField
        placeholder="Amount"
        keyboardType="numeric"
        value={formData.expenseAmount}
        onChangeText={handleAmountChange}
      />

      {/* Date Picker */}
      <TouchableOpacity style={styles.datePickerContainer} onPress={() => setDatePickerOpen(true)}>
        <Text style={styles.datePickerText}>Expense Date: {formData.expenseDate}</Text>
      </TouchableOpacity>
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

      {/* Submit Button */}
      <Button title="Submit Expense" onPress={handleSubmit} />

      {/* List of Expenses */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.expenseId?.toString() ?? Math.random().toString()}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <ExpenseItem
            category={item.expenseCategory}
            location={item.expenseLocation}
            amount={item.expenseAmount}
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
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
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
    marginBottom: 10,
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
});
