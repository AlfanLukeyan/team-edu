import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { ClassProvider, useClass } from '@/contexts/ClassContext';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';

function ClassLayoutContent() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { setClassId, classInfo } = useClass();
    const colorScheme = useColorScheme();
    const router = useRouter();

    useEffect(() => {
        console.log('ClassLayout: Received id parameter:', id);
        if (id && typeof id === 'string') {
            console.log('ClassLayout: Setting classId to:', id);
            setClassId(id);
        } else {
            console.log('ClassLayout: No valid id parameter received');
        }
    }, [id, setClassId]);

    const className = classInfo?.name || 'Class Details';

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

export default function ClassLayout() {
    return (
        <ClassProvider>
            <ClassLayoutContent />
        </ClassProvider>
    );
}