import { ChevronDown } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function FilterButton({ label, value, onPress, disabled }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled]}
      activeOpacity={0.7}
    >
      <Text style={value ? styles.textSelected : styles.textPlaceholder}>
        {value || label}
      </Text>
      <ChevronDown size={20} color="#484848" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFDFE7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  disabled: {
    backgroundColor: "#F7F6FB",
    opacity: 0.6,
  },
  textPlaceholder: {
    fontSize: 16,
    color: "#A0A0AB",
  },
  textSelected: {
    fontSize: 16,
    color: "#484848",
    fontWeight: "bold",
  },
});
