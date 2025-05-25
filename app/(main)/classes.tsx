import { ClassCard } from "@/components/ClassCard";
import { ScrollView, StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";
import { useRouter } from "expo-router";

export default function ClassesScreen() {
  const router = useRouter();
  return (
    <ThemedView style={{ flex: 1 }}>
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
            onPress={() => router.push({
              pathname: "/(class)/(tabs)",
              params: { id: classItem.id },
            })}
          />
        ))}
      </ThemedView>
    </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({});
