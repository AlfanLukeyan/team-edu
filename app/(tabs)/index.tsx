import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Calendar, type DateType } from '@/components/Calendar';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateType>();

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView>
        {selectedDate && (
          <ThemedText>
            Selected: {selectedDate.toLocaleString()}
          </ThemedText>
        )}
        <Pressable
          onPress={() => setIsCalendarVisible(!isCalendarVisible)}>
          <ThemedText type="defaultSemiBold">
            {isCalendarVisible ? 'Hide Calendar' : 'Show Calendar'}
          </ThemedText>
        </Pressable>
        {isCalendarVisible && (
          <ThemedView>
            <Calendar
              selected={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
              }}
            />
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
