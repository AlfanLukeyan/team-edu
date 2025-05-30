import { useClass } from '@/contexts/ClassContext';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function ClassIdLayout() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { setClassId, classInfo } = useClass();

    useEffect(() => {
        console.log('ClassIdLayout: Received id parameter:', id);
        if (id && typeof id === 'string') {
            console.log('ClassIdLayout: Setting classId to:', id);
            setClassId(id);
        } else {
            console.log('ClassIdLayout: No valid id parameter received');
        }
    }, [id, setClassId]);

    const className = classInfo?.name || 'Class Details';

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="(tabs)"
                options={{
                    title: className,
                }}
            />
        </Stack>
    );
}