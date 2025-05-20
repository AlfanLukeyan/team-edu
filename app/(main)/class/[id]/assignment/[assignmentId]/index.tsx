import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { response } from '@/data/response';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AssignmentDetailScreen() {
  const { assignmentId } = useLocalSearchParams<{ assignmentId: string }>();
  const insets = useSafeAreaInsets();
  
  // Find the weekly content containing this assignment
  const weekData = response.getWeeklyContent.data.find(
    (week) => week.id === assignmentId
  );
  
  const assignment = weekData?.assignment;

  if (!assignment) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText>Assignment not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.section}>
        <ThemedText type="bold" style={styles.title}>{assignment.title}</ThemedText>
        <ThemedText style={styles.subtitle}>Due: {assignment.dueDate}</ThemedText>
      </View>
      
      <View style={styles.section}>
        <ThemedText type="bold" style={styles.sectionTitle}>Description</ThemedText>
        <ThemedText>{assignment.description}</ThemedText>
      </View>
      
      <View style={styles.section}>
        <ThemedText type="bold" style={styles.sectionTitle}>Related Materials</ThemedText>
        <ThemedText>Week: {weekData.title}</ThemedText>
        {weekData.attachment && (
          <ThemedText>Attachment: {weekData.attachment.name}</ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
});