import { useState } from "react";
import { Pressable, ScrollView } from "react-native";

import { type DateType } from "@/components/Calendar";
import { CalendarModal } from "@/components/CalendarModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";


export default function HomeScreen() {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateType>();

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
        <Pressable onPress={() => setIsCalendarVisible(true)}>
          <ThemedText type="defaultSemiBold">
            Show Calendar
          </ThemedText>
        </Pressable>
      </ScrollView>
      <CalendarModal
        visible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        selected={selectedDate}
        onDateChange={setSelectedDate}
      />
    </ThemedView>
  );
}