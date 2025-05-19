import { Calendar, DateType } from "@/components/Calendar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  selected: DateType | undefined;
  onDateChange: (date: DateType) => void;
}

export function CalendarModal({
  visible,
  onClose,
  selected,
  onDateChange,
}: CalendarModalProps) {
  const theme = useColorScheme() ?? "light";

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.modalContent} isCard={true}>
          <View style={styles.header}>
            <ThemedText type="defaultSemiBold">Select Date & Time</ThemedText>
            <Pressable onPress={onClose}>
              <ThemedText
                style={{ color: Colors[theme].subtitle }}
                type="defaultSemiBold"
              >
                Done
              </ThemedText>
            </Pressable>
          </View>

          <Calendar
            selected={selected}
            onDateChange={(date) => {
              onDateChange(date);
            }}
          />
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    borderRadius: 15,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
});
