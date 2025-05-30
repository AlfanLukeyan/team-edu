import { StudentCard } from '@/components/StudentCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useClass } from '@/contexts/ClassContext';
import { classService } from '@/services/classService';
import { ClassMember } from '@/types/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from "react-native";

const StudentsScreen = () => {
    const { classId } = useClass();
    const apiURL = process.env.EXPO_PUBLIC_API_URL;
    const [members, setMembers] = useState<ClassMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchClassMembers = async () => {
        if (!classId) {
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const data = await classService.getClassMembers(classId);
            const students = data.filter(member => member.role === 'student');
            setMembers(students);
        } catch (err) {
            setError('Failed to load class members');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchClassMembers();
        setRefreshing(false);
    };

    useEffect(() => {
        if (classId) {
            fetchClassMembers();
        }
    }, [classId]);

    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText}>Loading students...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={styles.centered}>
                <ThemedText style={styles.errorText}>
                    {error}
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                {members.length === 0 ? (
                    <ThemedView style={styles.emptyState}>
                        <ThemedText style={styles.emptyText}>
                            No students found in this class
                        </ThemedText>
                    </ThemedView>
                ) : (
                    members.map((student) => (
                        <StudentCard
                            key={student.user_user_id}
                            user_id={student.user_user_id}
                            user_name={student.username}
                            user_profile_url={`${apiURL}/${student.photo_url}`}
                        />
                    ))
                )}
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        borderRadius: 15,
        margin: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    loadingText: {
        marginTop: 12,
        opacity: 0.7,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 20,
    },
    emptyText: {
        opacity: 0.7,
        textAlign: 'center',
    },
});

export default StudentsScreen;