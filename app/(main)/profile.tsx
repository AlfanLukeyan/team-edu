import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation, useRouter } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [showActionMenu, setShowActionMenu] = useState(false);

  const handleLogout = () => {
    setShowActionMenu(false);
    logout();
    router.replace('/(auth)/onboarding');
  };

  const handleEditProfile = () => {
    setShowActionMenu(false);
    console.log('Edit profile pressed');
    // Add your edit profile navigation here
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowActionMenu(true)}
          style={{ marginRight: 16 }}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={Colors[colorScheme ?? 'light'].text}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colorScheme]);

  const handleChangeFaceReference = () => {
    console.log('Change face reference pressed');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: user?.profileImage || 'https://randomuser.me/api/portraits/lego/4.jpg'
          }}
          style={styles.profileImage}
          contentFit="cover"
        />

        <ThemedText type="defaultSemiBold" style={styles.userName}>
          {user?.name || 'User Name'}
        </ThemedText>

        <ThemedText type="default" style={styles.userEmail}>
          Email: {user?.email || 'user@example.com'}
        </ThemedText>
      </View>

      <View style={styles.actionContainer}>
        <View style={styles.actionButton}>
          <ThemedText type="default" style={styles.buttonText}>
            Teacher
          </ThemedText>
        </View>
        
        <TouchableOpacity
          onPress={handleChangeFaceReference}
          style={styles.actionButton}
        >
          <ThemedText type="default" style={styles.buttonText}>
            Change Face Reference
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Custom Action Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showActionMenu}
        onRequestClose={() => setShowActionMenu(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowActionMenu(false)}
        >
          <View style={styles.menuPositioning}>
            <View style={[styles.actionMenuContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleEditProfile}
              >
                <Ionicons 
                  name="create-outline" 
                  size={20} 
                  color={Colors[colorScheme ?? 'light'].text}
                  style={styles.menuIcon}
                />
                <ThemedText type="default">Edit Profile</ThemedText>
              </TouchableOpacity>
              
              <View style={[styles.separator, { backgroundColor: Colors[colorScheme ?? 'light'].border }]} />
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleLogout}
              >
                <Ionicons 
                  name="log-out-outline" 
                  size={20} 
                  color="#FF3B30"
                  style={styles.menuIcon}
                />
                <ThemedText type="default" style={{ color: '#FF3B30' }}>Log Out</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginBottom: 8,
  },
  userName: {
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmail: {
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuPositioning: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 20,
    zIndex: 1000,
  },
  actionMenuContainer: {
    borderRadius: 12,
    padding: 4,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuIcon: {
    marginRight: 12,
  },
  separator: {
    height: 1,
    marginHorizontal: 8,
  },
});