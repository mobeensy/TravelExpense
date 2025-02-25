import React from "react";
import { TextInput, StyleSheet, View, Text, TextInputProps } from "react-native";

interface TextInputFieldProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: object; // ✅ Allow custom styles
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  style, // ✅ Accept custom styles
  ...rest
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
    </View>
  );
};

export default TextInputField;

const styles = StyleSheet.create({
  container: {},
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
  },
});
