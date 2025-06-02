import { ClassCard } from "@/components/ClassCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { classService } from "@/services/classService";
import { Class } from "@/types/class";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, useColorScheme } from "react-native";

export default function ClassesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();

    // State management
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch classes function
    const fetchClasses = async () => {
        try {
            setError(null);
            const classesData = await classService.getClasses();
            setClasses(classesData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Refresh classes function
    const refetchClasses = async () => {
        try {
            setRefreshing(true);
            setError(null);
            const classesData = await classService.getClasses();
            setClasses(classesData);
        } catch (err: any) {
            setError(err.message || 'Failed to refresh classes');
        } finally {
            setRefreshing(false);
        }
    };

    // Load classes on component mount
    useEffect(() => {
        fetchClasses();
    }, []);

    // Loading state
    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    flexGrow: 1
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refetchClasses}
                    />
                }
            >
                {classes.length === 0 ? (
                    <ThemedView style={styles.emptyState}>
                        <ThemedText style={styles.emptyText}>
                            No classes found
                        </ThemedText>
                        <ThemedText style={styles.emptySubText}>
                            Pull down to refresh or check back later
                        </ThemedText>
                    </ThemedView>
                ) : (
                    <ThemedView>
                        {classes.map((classItem) => (
                            <ClassCard
                                key={classItem.id}
                                title={classItem.name || 'Untitled Class'}
                                classCode={classItem.tag || 'No Code'}
                                description={classItem.description || 'No description available'}
                                onPress={() => {
                                    router.push(`/(class)/${classItem.id}/(tabs)`);
                                }}
                            />
                        ))}
                    </ThemedView>
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryText: {
        color: '#007AFF',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubText: {
        opacity: 0.7,
        textAlign: 'center',
    },
    errorIcon: {
        marginBottom: 16,
        opacity: 0.5,
    },
});