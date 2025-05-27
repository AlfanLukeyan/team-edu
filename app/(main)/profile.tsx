import ActionMenu, { ActionMenuItem } from '@/components/ActionMenu';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation, useRouter } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const [showActionMenu, setShowActionMenu] = useState(false);

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/onboarding');
    };

    const handleEditProfile = () => {
        console.log('Edit profile pressed');
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

    const actionMenuItems: ActionMenuItem[] = [
        {
            id: 'edit-profile',
            title: 'Edit Profile',
            icon: 'create-outline',
            onPress: handleEditProfile,
        },
        {
            id: 'logout',
            title: 'Log Out',
            icon: 'log-out-outline',
            onPress: handleLogout,
            destructive: true,
        },
    ];

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

            {/* Action Menu */}
            <ActionMenu
                visible={showActionMenu}
                onClose={() => setShowActionMenu(false)}
                items={actionMenuItems}
                position="top-right"
            />
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
});