import { ClassCard } from "@/components/ClassCard";
import { ScrollView, StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";

export default function ClassesScreen() {
  return (
    <ScrollView 
      style={{ flex: 1 }} 
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
    >
      <ThemedView>
        {response.getAllClasses.data.map((classItem) => (
          <ClassCard
            key={classItem.id}
            title={classItem.title}
            classCode={classItem.class_code}
            description={classItem.desc}
          />
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
