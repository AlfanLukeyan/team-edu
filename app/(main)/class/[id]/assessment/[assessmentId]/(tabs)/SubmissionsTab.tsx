import { SubmissionCard } from "@/components/SubmissionCard";
import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";
import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";

export default function SubmissionsTab() {
  const [submissions, setSubmissions] = useState(response.getAllSubmissions.data);

  const handleDeleteSubmission = (id: string) => {
    setSubmissions(submissions.filter(submission => submission.id !== id));
  };

  type Submission = {
    id: string;
    user_profile_url: string;
    user_name: string;
    user_id: string;
    time_remaining: number;
    status: string;
    score: number;
    total_score: number;
  };

  const renderSubmission = ({ item }: { item: Submission }) => (
    <SubmissionCard
      id={item.id}
      user_profile_url={item.user_profile_url}
      user_name={item.user_name}
      user_id={item.user_id}
      time_remaining={item.time_remaining}
      status={item.status}
      score={item.score}
      total_score={item.total_score}
      onDelete={handleDeleteSubmission}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={submissions}
        renderItem={renderSubmission}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 8,
    paddingVertical: 8,
    paddingBottom: 20,
  },
});