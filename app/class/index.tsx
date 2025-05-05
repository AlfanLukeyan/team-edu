import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = response.getAllClasses.data.find((item) => item.id === id);
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 24 }}>
        <View style={{ flex: 1, gap: 16 }}>
          <View style={{ gap: 8 }}>
          <ThemedText type="title">{data?.title}</ThemedText>
          <ThemedText type="subtitle">{data?.class_code}</ThemedText>
          </View>
          <ThemedText type="subtitle">{data?.desc}</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({});
