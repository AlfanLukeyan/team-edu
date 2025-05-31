import { useClass } from '@/contexts/ClassContext';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function ClassIdLayout() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { setClassId, classInfo } = useClass();

    useEffect(() => {
        if (id) {
            setClassId(id);
        }
    }, [id, setClassId]);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="(tabs)"
                options={{
                    title: "Class Details",
                }}
            />
        </Stack>
    );
}