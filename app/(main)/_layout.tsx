import { Stack } from 'expo-router';

export default function MainLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8f9fa' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="class" options={{ headerShown: false }} />
    </Stack>
  );
}