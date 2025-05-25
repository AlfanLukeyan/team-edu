import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { response } from '@/data/response';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

const AboutScreen = () => {
  const [selectedClass, setSelectedClass] = useState(response.getAllClasses.data[0]);
  
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, margin: 16, borderRadius: 15 }}>
        <ThemedText type='title'>{selectedClass.title}</ThemedText>
        <ThemedText type='subtitle' style={{ marginBottom: 8 }}>
          {selectedClass.class_code}
        </ThemedText>
        <ThemedText>
          {selectedClass.desc}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

export default AboutScreen;