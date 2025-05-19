import { Button } from "@/components/teacher/Button";
import { ThemedView } from "@/components/ThemedView";
import { WeeklyCard } from "@/components/WeeklyCard";
import { response } from "@/data/response";
import { ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface WeeklyTabProps {
  onCreatePress: () => void;
  isBottomSheetVisible?: boolean;
}

export default function WeeklyTab({ onCreatePress, isBottomSheetVisible }: WeeklyTabProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16, gap: 16 }}
          scrollEnabled={!isBottomSheetVisible}
        >
          <Button icon="plus" onPress={onCreatePress}>
            Create Weekly Section
          </Button>
          
          {response.getWeeklyContent.data.map((item) => (
            <WeeklyCard
              key={item.id}
              count={item.count}
              title={item.title}
              description={item.description}
              videoUrl={item.videoUrl}
              attachment={{
                name: item.attachment.name,
                url: item.attachment.url,
              }}
              assignment={item.assignment && {
                title: item.assignment.title,
                dueDate: item.assignment.dueDate,
                description: item.assignment.description,
              }}
            />
          ))}
        </ScrollView>
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});