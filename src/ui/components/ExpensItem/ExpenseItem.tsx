import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Define the prop types
interface ExpenseItemProps {
  category: string;
  location: string;
  amount: string;
  currency: string;
  date: string;
  details: string;
  onEdit?: () => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({
  category,
  location,
  amount,
  currency,
  date,
  details,
  onEdit,
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.mainItemRow}>
        <Text style={styles.itemText}>{date}</Text>
        <Text style={styles.itemText}>
          {amount} {currency}
        </Text>
      </View>
      <View style={styles.subRow}>
        <Text style={styles.categoryText} numberOfLines={1} ellipsizeMode="tail">
          {category.length > 15 ? category.substring(0, 15) + "..." : category}
        </Text>
        <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
          {location.length > 15 ? location.substring(0, 15) + "..." : location}
        </Text>
        {onEdit && (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ExpenseItem;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    flexDirection: "column",
  },
  mainItemRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Distributes items evenly
    alignItems: "center", // Aligns items vertically in the center
    width: "100%", // Takes the full available width
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "flex-start", // Distributes items evenly
    gap: 16,
    alignItems: "center", // Aligns items vertically in the center
    width: "100%", // Takes the full available width
  },
  itemText: {
    fontSize: 16,
    fontWeight: "700",
  },
  categoryText: {
    fontSize: 14,
    flexBasis: "40%", // Takes at least 40% of available space
    overflow: "hidden",
  },
  locationText: {
    fontSize: 14,
    flex: 1, // Fills remaining space
    overflow: "hidden",
  },
  editButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});
