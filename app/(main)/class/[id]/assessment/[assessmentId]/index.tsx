import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { response } from '@/data/response';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AssessmentDetailScreen() {
  const { assessmentId } = useLocalSearchParams<{ assessmentId: string }>();
  const insets = useSafeAreaInsets();
  
  // Find the assessment
  const assessment = response.getAllAssessments.data.find(
    (item) => item.id === assessmentId
  );

  if (!assessment) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText>Assessment not found</ThemedText>
      </ThemedView>
    );
  }

  // Format dates
  const startDate = new Date(assessment.start_date).toLocaleString();
  const endDate = new Date(assessment.end_date).toLocaleString();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.section}>
        <View style={styles.typeContainer}>
          <ThemedText type="bold" style={styles.type}>{assessment.type}</ThemedText>
        </View>
        <ThemedText type="bold" style={styles.title}>{assessment.title}</ThemedText>
        <ThemedText style={styles.marks}>Total Marks: {assessment.total_marks}</ThemedText>
      </View>
      
      <View style={styles.section}>
        <ThemedText type="bold" style={styles.sectionTitle}>Description</ThemedText>
        <ThemedText>{assessment.description}</ThemedText>
      </View>
      
      <View style={styles.section}>
        <ThemedText type="bold" style={styles.sectionTitle}>Schedule</ThemedText>
        <ThemedText>Start: {startDate}</ThemedText>
        <ThemedText>End: {endDate}</ThemedText>
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
  typeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    
    borderRadius: 16,
    marginBottom: 8,
  },
  type: {
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
  marks: {
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
});