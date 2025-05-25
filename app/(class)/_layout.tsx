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

export default function ClassLayout() {
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
        name="(tabs)"
        options={{
          title: className,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => {
                router.navigate('/(main)/classes');
              }}
            >
              <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}