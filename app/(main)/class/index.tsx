import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { response } from "@/data/response";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import {
  SceneMap,
  TabBar,
  TabBarItem,
  TabBarProps,
  TabView,
} from "react-native-tab-view";
import AssessmentsTab from "./tabs/AssessmentsTab";
import StudentsTab from "./tabs/StudentsTab";
import WeeklyTab from "./tabs/WeeklyTab";

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = response.getAllClasses.data.find((item) => item.id === id);
  const layout = useWindowDimensions();
  const theme = useColorScheme();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "weekly", title: "Weekly" },
    { key: "assessments", title: "Assessments" },
    { key: "students", title: "Students" },
  ]);

  const renderScene = SceneMap({
    weekly: WeeklyTab,
    assessments: AssessmentsTab,
    students: StudentsTab,
  });

  const renderTabBar = (props: TabBarProps<{ key: string; title: string }>) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Colors[theme ?? "light"].tint }}
      style={{ backgroundColor: Colors[theme ?? "light"].background }}
      activeColor={Colors[theme ?? "light"].tint}
      inactiveColor={Colors[theme ?? "light"].text}
      renderTabBarItem={(tabBarItemProps) => {
        const { key, ...restProps } = tabBarItemProps;
        return (
          <TabBarItem key={key} {...restProps} labelStyle={styles.label} />
        );
      }}
    />
  );

  return (
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontFamily: "Poppins-Regular",
  },
});
