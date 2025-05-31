import { Colors } from '@/constants/Colors';
import { readableHash } from '@/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface StudentCardProps {
    user_id: string;
    user_name: string;
    user_profile_url?: string;
    onPress?: () => void;
}

export function StudentCard({
    user_id,
    user_name,
    user_profile_url,
    onPress
}: StudentCardProps) {
    const [imageError, setImageError] = useState(false);
    const theme = useColorScheme() || 'light';

    const handleImageError = () => {
        setImageError(true);
    };

    const shouldShowImage = user_profile_url && !imageError;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <ThemedView style={styles.card} isCard={true}>
                <View style={styles.avatarContainer}>
                    {shouldShowImage ? (
                        <Image
                            source={{
                                uri: user_profile_url,
                                cache: 'reload'
                            }}
                            style={styles.avatar}
                            onError={handleImageError}
                        />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: Colors[theme].tint + '20' }]}>
                            <Ionicons
                                name="person-outline"
                                size={24}
                                color={Colors[theme].text}
                            />
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <ThemedText style={styles.name}>
                        {user_name}
                    </ThemedText>

                    <ThemedText style={styles.userId}>
                        {readableHash(user_id, 'STU')}
                    </ThemedText>
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 15
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,

        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    userId: {
        fontSize: 12,
        opacity: 0.7,
        fontFamily: 'monospace',
    },
});