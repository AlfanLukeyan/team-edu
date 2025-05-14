import CreateWeeklySection, {
  CreateWeeklySectionRef,
} from "@/components/teacher/CreateWeeklySection";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { response } from "@/data/response";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SceneMap, TabBar, TabBarItem, TabView } from "react-native-tab-view";
import AssessmentsTab from "./tabs/AssessmentsTab";
import StudentsTab from "./tabs/StudentsTab";
import WeeklyTab from "./tabs/WeeklyTab";

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = response.getAllClasses.data.find((item) => item.id === id);
  const layout = useWindowDimensions();
  const theme = useColorScheme();
  const createSectionRef = useRef<CreateWeeklySectionRef>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "weekly", title: "Weekly" },
    { key: "assessments", title: "Assessments" },
    { key: "students", title: "Students" },
  ]);

  const renderScene = SceneMap({
    weekly: () => (
      <WeeklyTab onCreatePress={() => createSectionRef.current?.open()} />
    ),
    assessments: AssessmentsTab,
    students: StudentsTab,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Colors[theme ?? "light"].tint }}
      style={{ backgroundColor: Colors[theme ?? "light"].background }}
      activeColor={Colors[theme ?? "light"].tint}
      inactiveColor={Colors[theme ?? "light"].text}
      renderTabBarItem={(tabBarItemProps: any) => {
        const { key, ...restProps } = tabBarItemProps;
        return (
          <TabBarItem
            key={key}
            {...restProps}
            labelStyle={styles.label}
          />
        );
      }}
    />
  );

  const handleCreateSection = (data: {
    title: string;
    description: string;
    videoUrl: string;
  }) => {
    console.log("New section created:", data);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">{data?.title}</ThemedText>
          <ThemedText type="default">{data?.class_code}</ThemedText>
          <ThemedText type="default">{data?.desc}</ThemedText>
        </ThemedView>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
          swipeEnabled={true}
        />
        
        {isModalOpen && (
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={50}
            tint={theme === 'dark' ? 'dark' : 'light'}
            experimentalBlurMethod={Platform.OS === 'ios' ? 'none' : 'dimezisBlurView'}
          />
        )}
        
        <CreateWeeklySection
          ref={createSectionRef}
          onSubmit={handleCreateSection}
          onStateChange={setIsModalOpen}
        />
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  label: {
    fontFamily: "Poppins-Regular",
  },
});