import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Define the prop types
interface ExpenseItemProps {
  category: string;
  location: string;
  amount: string;
  date: string;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ category, location, amount, date }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.mainItemRow}>
        <Text style={styles.itemText}>{date}</Text>
        <Text style={styles.itemText}>${amount}</Text>
      </View>
      <View style={styles.subRow}>
        <Text style={styles.categoryText} numberOfLines={1} ellipsizeMode="tail">
          {category.length > 15 ? category.substring(0, 15) + "..." : category}
        </Text>
        <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
          {location.length > 15 ? location.substring(0, 15) + "..." : location}
        </Text>
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
    justifyContent: "space-between", // ✅ Distributes items evenly
    alignItems: "center", // ✅ Aligns items vertically in the center
    width: "100%", // ✅ Takes the full available width
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "flex-start", // ✅ Distributes items evenly
    gap: 16,
    alignItems: "center", // ✅ Aligns items vertically in the center
    width: "100%", // ✅ Takes the full available width
  },
  itemText: {
    fontSize: 16,
    fontWeight: "700",
  },
  categoryText: {
    fontSize: 14,
    flexBasis: "40%", // ✅ Takes at least 50% of available space
    // minWidth: 100, // ✅ Ensures a minimum space for 18 characters (~5px per char)
    overflow: "hidden",
  },
  locationText: {
    fontSize: 14,
    flex: 1, // ✅ Fills remaining space
    overflow: "hidden",
  },
});
