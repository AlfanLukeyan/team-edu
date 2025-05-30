import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useClass } from '@/contexts/ClassContext';
import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

const AboutClassScreen = () => {
    const { classInfo, loading, error, refetchClassInfo } = useClass();

    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText}>Loading class information...</ThemedText>
            </ThemedView>
        );
    }

    if (error || !classInfo) {
        return (
            <ThemedView style={styles.centered}>
                <ThemedText style={styles.errorText}>
                    {error || 'Failed to load class information'}
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
                        refreshing={loading}
                        onRefresh={refetchClassInfo}
                    />
                }
            >
                <View style={styles.content}>
                    {/* Class Basic Info */}
                    <View style={styles.headerSection}>
                        <ThemedText type='title'>{classInfo.name}</ThemedText>
                        <ThemedText type='subtitle' style={styles.classCode}>
                            {classInfo.tag}
                        </ThemedText>
                        <ThemedText style={styles.description}>
                            {classInfo.description}
                        </ThemedText>
                    </View>

                    {/* Teacher Info */}
                    <View style={styles.section}>
                        <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
                            Teacher
                        </ThemedText>
                        <ThemedText>{classInfo.teacher}</ThemedText>
                    </View>

                    {/* Class Information */}
                    <View style={styles.section}>
                        <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
                            Class Information
                        </ThemedText>
                        <ThemedText style={styles.classId}>
                            Class ID: {classInfo.id}
                        </ThemedText>
                        <ThemedText style={styles.teacherId}>
                            Teacher ID: {classInfo.teacher_id}
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

export default AboutClassScreen;