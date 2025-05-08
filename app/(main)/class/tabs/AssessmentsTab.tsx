import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function AssessmentsTab() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Assessments</ThemedText>
      {/* Add your weekly content here */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});