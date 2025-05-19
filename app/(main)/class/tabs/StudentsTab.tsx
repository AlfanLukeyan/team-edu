import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";

export default function StudentsTab() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Students</ThemedText>
      {/* Add your students content here */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});