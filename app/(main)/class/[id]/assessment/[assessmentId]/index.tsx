import { CompletedCountCard } from "@/components/CompletedCountCard";
import { DueDateCard } from "@/components/DueDateCard";
import { CustomTabBar } from "@/components/TabBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TimeRemainingCard } from "@/components/TimeRemainingCard";
import { response } from "@/data/response";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SceneMap, TabView } from "react-native-tab-view";
import QuestionsTab from "./(tabs)/QuestionsTab";
import SubmissionsTab from "./(tabs)/SubmissionsTab";
import ToDoTab from "./(tabs)/ToDoTab";

export default function AssessmentDetailScreen() {
  const { assessmentId } = useLocalSearchParams<{ assessmentId: string }>();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();

  const { index, routes, setIndex } = useTabNavigation({
    initialRoutes: [
      { key: "submissions", title: "Submissions" },
      { key: "questions", title: "Questions" },
      { key: "todo", title: "Todo" },
    ],
  });

  const renderScene = SceneMap({
    submissions: () => <SubmissionsTab />,
    questions: () => <QuestionsTab />,
    todo: () => <ToDoTab />,
  });

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
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit", 
      year: "numeric"
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    };
    
    return {
      date: date.toLocaleDateString("en-US", dateOptions),
      time: date.toLocaleTimeString("en-US", timeOptions)
    };
  };

  const startDateTime = formatDateTime(assessment.start_date);
  const endDateTime = formatDateTime(assessment.end_date);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{assessment.title}</ThemedText>
      <ThemedText type="default">
        Description: {assessment.description}
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 16,
          gap: 12,
        }}
      >
        <DueDateCard 
          startTime={startDateTime.time}
          startDate={startDateTime.date}
          endTime={endDateTime.time}
          endDate={endDateTime.date}
          style={{ flex: 1 }}
        />
        <CompletedCountCard comletedCount={20} totalCount={13} style={{flex: 1}} />
      </View>
      <View>
        <TimeRemainingCard duration={assessment.duration} />
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => <CustomTabBar props={props} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
