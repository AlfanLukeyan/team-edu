import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { ClassProvider } from '@/contexts/ClassContext';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, useColorScheme } from 'react-native';

export default function ClassLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();

    return (
        <ClassProvider>
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
                    name="[id]"
                    options={{
                        title: 'Class Details',
                        headerShown: true,
                        headerBackVisible: false,
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <IconSymbol
                                    name="chevron.left"
                                    size={24}
                                    color={Colors[colorScheme ?? 'light'].tint}
                                />
                                <ThemedText>Back</ThemedText>
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>
        </ClassProvider>
    );
}