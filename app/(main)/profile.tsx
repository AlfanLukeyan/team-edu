import { StyleSheet } from 'react-native';

import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/onboarding');
  }
    
  return (
    <Button onPress={handleLogout}>
      Logout
    </Button>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
