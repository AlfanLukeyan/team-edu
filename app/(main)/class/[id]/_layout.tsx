import { IconSymbol } from '@/components/ui/IconSymbol';
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
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [className, setClassName] = useState('Class Details');

  const headerBackground = isDark ? '#1f2937' : '#ffffff';
  const headerTintColor = isDark ? '#f3f4f6' : '#111827';

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
          backgroundColor: headerBackground,
        },
        headerTintColor: headerTintColor,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 18,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: className,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => {
                router.push('/(main)/(tabs)/classes');
              }}
            >
              <IconSymbol name="chevron.left" size={24} color={headerTintColor}/>
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