import { StudentCard } from "@/components/StudentCard";
import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";
import { TabContentProps } from "@/types/common";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function StudentsTab({ onCreatePress }: TabContentProps) {
  const [students, setStudents] = useState(response.getAllStudentsByClassId.data);
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
      >
        {students.map((student) => (
          <StudentCard
            key={student.user_id}
            user_id={student.user_id}
            user_name={student.user_name}
            user_profile_url={student.user_profile_url}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
});