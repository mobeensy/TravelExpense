import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet } from "react-native";
import { CURRENCIES, Currency } from "../../../constants/currencies";

type CurrencyPickerProps = {
  selectedCurrency: string; // ISO code (e.g., "USD")
  onSelect: (currency: string) => void; // Lambda function to handle selection
};

const CurrencyPicker: React.FC<CurrencyPickerProps> = ({ selectedCurrency, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      {/* Dropdown Trigger */}
      <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.pickerText}>{selectedCurrency || "Select Currency"}</Text>
      </TouchableOpacity>

      {/* Currency Selection Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={CURRENCIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.currencyItem}
                  onPress={() => {
                    onSelect(item.code); // Calls the lambda function with the selected currency
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.currencyText}>
                    ({item.code}) {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CurrencyPicker;

const styles = StyleSheet.create({
  pickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#aaaaaaa",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  currencyItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  currencyText: {
    fontSize: 16,
  },
});
