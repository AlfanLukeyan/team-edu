import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { response } from '@/data/response';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';

type AssignmentParams = {
    id: string;
};

export default function AssignmentLayout() {
    const { id } = useLocalSearchParams<AssignmentParams>();
    const colorScheme = useColorScheme();
    const router = useRouter();
    const [assignmentTitle, setAssignmentTitle] = useState('Assignment Details');

    useEffect(() => {
        if (id) {
            const assignmentData = response.getAllAssignments.data.find(
                (assignment) => assignment.id === id.toString()
            );
            if (assignmentData?.title) {
                setAssignmentTitle(assignmentData.title);
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
                    title: assignmentTitle,
                    headerShown: true,
                    headerBackVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <IconSymbol
                                name="chevron.left"
                                size={24}
                                color={Colors[colorScheme ?? 'light'].tint}
                            />
                            <ThemedText>
                                Back
                            </ThemedText>
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
}