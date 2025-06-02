import { AssignmentSubmissionCard } from '@/components/AssignmentSubmissionCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAssignment } from '@/contexts/AssignmentContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export default function AssignmentSubmissionsScreen() {
    const theme = useColorScheme() ?? 'light';
    const { submissions, loading, error, refetchSubmissions } = useAssignment();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetchSubmissions();
        setRefreshing(false);
    }, [refetchSubmissions]);

    useEffect(() => {
        refetchSubmissions();
    }, [refetchSubmissions]);

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors[theme].tint} />
                <ThemedText style={{ marginTop: 16 }}>Loading submissions...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ThemedText style={{ textAlign: 'center', marginBottom: 16 }}>
                    {error}
                </ThemedText>
                <ThemedText
                    style={{ color: Colors[theme].tint, textAlign: 'center' }}
                    onPress={refetchSubmissions}
                >
                    Tap to retry
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[Colors[theme].tint]}
                        tintColor={Colors[theme].tint}
                    />
                }
            >
                <View style={styles.submissionsList}>
                    {submissions.length === 0 ? (
                        <ThemedView style={styles.emptyState}>
                            <ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>
                                No submissions found
                            </ThemedText>
                        </ThemedView>
                    ) : (
                        submissions.map((submission) => (
                            <AssignmentSubmissionCard
                                key={submission.user_user_id}
                                id={submission.id_submission || submission.user_user_id}
                                user_profile_url={submission.photo_url}
                                user_name={submission.username}
                                user_id={submission.user_user_id}
                                status={submission.status}
                                score={submission.score}
                                submitted_at={submission.created_at}
                                file_name={submission.filename}
                                file_url={submission.link_file}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scrollView: {
        flex: 1,
        borderRadius: 15,
        margin: 16,
    },
    submissionsList: {
        gap: 8,
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        borderRadius: 12,
    },
});