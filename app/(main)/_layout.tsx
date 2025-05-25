import { useAuth } from '@/hooks/useAuth';
import { Redirect, Stack } from 'expo-router';

export default function MainLayout() {
  const { user, isLoading } = useAuth();
  
  if (!user) {
    return <Redirect href="/(auth)/onboarding" />;
  }
  
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