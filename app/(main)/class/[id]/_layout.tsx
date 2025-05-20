import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { response } from '@/data/response';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';

type RouteParams = {
  params?: {
    assessmentId?: string;
    assignmentId?: string;
  };
};

export default function ClassDetailLayout() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [className, setClassName] = useState('Class Details');

  useEffect(() => {
    if (id) {
      const classData = response.getAllClasses.data.find(
        (classItem) => classItem.id === id.toString()
      );

      if (classData?.title) {
        setClassName(classData.title);
      }
    }
  }, [id]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 16,
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Class Details",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => {
                router.navigate('/(main)/(tabs)/classes');
              }}
            >
              <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="assessment/[assessmentId]/index"
        options={({ route }: { route: RouteParams }) => {
          const assessmentId = route?.params?.assessmentId;
          const assessmentData = assessmentId ?
            response.getAllAssessments.data.find(
              (assessment) => assessment.id === assessmentId
            ) : null;

          return {
            title: assessmentData?.title || 'Assessment',
            headerShown: true,
            presentation: 'modal',
          };
        }}
      />
      <Stack.Screen
        name="assignment/[assignmentId]/index"
        options={({ route }: { route: RouteParams }) => {
          const assignmentId = route?.params?.assignmentId;
          const weekData = assignmentId ?
            response.getWeeklyContent.data.find(
              (week) => week.id === assignmentId
            ) : null;

          return {
            title: weekData?.assignment?.title || 'Assignment',
            headerShown: true,
            presentation: 'modal',
          };
        }}
      />
    </Stack>
  );
}