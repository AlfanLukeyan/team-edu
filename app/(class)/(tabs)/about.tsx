import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useClassDetail } from '@/hooks/useClassDetail';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

const AboutScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { 
        classDetail, 
        loading, 
        refreshing, 
        error, 
        refreshClassDetail,
        progress 
    } = useClassDetail(id);

    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText}>Loading class details...</ThemedText>
            </ThemedView>
        );
    }

    if (error || !classDetail) {
        return (
            <ThemedView style={styles.centered}>
                <ThemedText style={styles.errorText}>
                    {error || 'Failed to load class details'}
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView 
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshClassDetail}
                    />
                }
            >
                <View style={styles.content}>
                    {/* Class Basic Info */}
                    <View style={styles.headerSection}>
                        <ThemedText type='title'>{classDetail.name}</ThemedText>
                        <ThemedText type='subtitle' style={styles.classCode}>
                            {classDetail.tag}
                        </ThemedText>
                        <ThemedText style={styles.description}>
                            {classDetail.description}
                        </ThemedText>
                    </View>

                    {/* Teacher Info */}
                    <View style={styles.section}>
                        <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
                            Teacher
                        </ThemedText>
                        <ThemedText>{classDetail.teacher}</ThemedText>
                    </View>

                    {/* Progress Info */}
                    {progress && (
                        <View style={styles.section}>
                            <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
                                Course Progress
                            </ThemedText>
                            <View style={styles.progressContainer}>
                                <ThemedText>
                                    Completed: {progress.completed}/{progress.total} weeks
                                </ThemedText>
                                <ThemedText style={styles.progressPercentage}>
                                    {progress.percentage}% Complete
                                </ThemedText>
                            </View>
                        </View>
                    )}

                    {/* Class Statistics */}
                    <View style={styles.section}>
                        <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
                            Statistics
                        </ThemedText>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <ThemedText type='defaultSemiBold'>
                                    {classDetail.week.length}
                                </ThemedText>
                                <ThemedText style={styles.statLabel}>Total Weeks</ThemedText>
                            </View>
                            <View style={styles.statItem}>
                                <ThemedText type='defaultSemiBold'>
                                    {classDetail.week.filter(week => week.assignment).length}
                                </ThemedText>
                                <ThemedText style={styles.statLabel}>Assignments</ThemedText>
                            </View>
                            <View style={styles.statItem}>
                                <ThemedText type='defaultSemiBold'>
                                    {classDetail.week.filter(week => 
                                        week.item_pembelajaran?.urlVideo
                                    ).length}
                                </ThemedText>
                                <ThemedText style={styles.statLabel}>Videos</ThemedText>
                            </View>
                        </View>
                    </View>

                    {/* Class ID for Reference */}
                    <View style={styles.section}>
                        <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
                            Class Information
                        </ThemedText>
                        <ThemedText style={styles.classId}>
                            Class ID: {classDetail.id_kelas}
                        </ThemedText>
                        <ThemedText style={styles.teacherId}>
                            Teacher ID: {classDetail.teacher_id}
                        </ThemedText>
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        margin: 16,
        borderRadius: 15,
    },
    content: {
        gap: 20,
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
    headerSection: {
        marginBottom: 8,
    },
    classCode: {
        marginBottom: 8,
        opacity: 0.8,
    },
    description: {
        lineHeight: 22,
    },
    section: {
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 4,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
    },
    progressPercentage: {
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
    },
    statItem: {
        alignItems: 'center',
        gap: 4,
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.7,
    },
    classId: {
        fontSize: 12,
        opacity: 0.6,
        fontFamily: 'monospace',
    },
    teacherId: {
        fontSize: 12,
        opacity: 0.6,
        fontFamily: 'monospace',
    },
});

export default AboutScreen;