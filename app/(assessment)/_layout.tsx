import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { response } from '@/data/response';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';

type AssessmentParams = {
    id: string;
};

export default function AssessmentLayout() {
    const { id } = useLocalSearchParams<AssessmentParams>();
    const colorScheme = useColorScheme();
    const router = useRouter();
    const [assessmentTitle, setAssessmentTitle] = useState('Assessment Details');

    useEffect(() => {
        if (id) {
            const assessmentData = response.getAllAssessments.data.find(
                (assessment) => assessment.id === id.toString()
            );
            if (assessmentData?.title) {
                setAssessmentTitle(assessmentData.title);
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
                    title: assessmentTitle,
                    headerShown: true,
                    headerBackVisible: false,
                    headerBackTitle: "Back",
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
            <Stack.Screen
                name="session"
                options={{
                    title: 'Assessment Session',
                    headerShown: true,
                    headerBackVisible: false,
                    headerBackTitle: "Back",
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