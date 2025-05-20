import { SubmissionCard } from "@/components/SubmissionCard";
import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ToDoTab() {
    const [submissions, setSubmissions] = useState(response.getAllTodo.data);
  
    const handleDeleteSubmission = (id: string) => {
      setSubmissions(submissions.filter(submission => submission.id !== id));
    };

    
    return (
    <ThemedView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ gap: 8, paddingVertical: 8 }}>
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              id={submission.id}
              user_profile_url={submission.user_profile_url}
              user_name={submission.user_name}
              user_id={submission.user_id}
              time_remaining={submission.time_remaining ?? undefined}
              status={submission.status}
              score={submission.score ?? undefined}
              total_score={submission.total_score ?? undefined}
              onDelete={handleDeleteSubmission}
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});