import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UpcomingAssessmentCard } from "@/components/UpcomingAssessmentCard";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { assessmentService } from "@/services/assessmentService";
import { ClassAssessment, ComponentAssessment } from "@/types/api";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";

interface ClassAssessmentData {
    classTitle: string;
    classCode: string;
    classId: string;
    assessments: ComponentAssessment[];
}

export default function HomeScreen() {
    const router = useRouter();
    const theme = useColorScheme() ?? 'light';
    const [upcomingAssessments, setUpcomingAssessments] = useState<ClassAssessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUpcomingAssessments = useCallback(async () => {
        try {
            setError(null);
            const data = await assessmentService.getUpcomingAssessments();
            setUpcomingAssessments(data);
        } catch (error: any) {
            console.error('Failed to fetch upcoming assessments:', error);
            setError(error.message || 'Failed to load assessments');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchUpcomingAssessments();
        setRefreshing(false);
    }, [fetchUpcomingAssessments]);

    useEffect(() => {
        fetchUpcomingAssessments();
    }, [fetchUpcomingAssessments]);

    const handleAssessmentPress = (assessment: ComponentAssessment) => {
        router.push(`/(assessment)/${assessment.id}/(tabs)`);
    };

    const componentData: ClassAssessmentData[] = assessmentService.transformToComponentFormat(upcomingAssessments);

    if (loading) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors[theme].tint} />
                <ThemedText style={{ marginTop: 16 }}>Loading assessments...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <ThemedText style={{ textAlign: 'center', marginBottom: 16 }}>
                    {error}
                </ThemedText>
                <ThemedText 
                    style={{ color: Colors[theme].tint, textAlign: 'center' }}
                    onPress={fetchUpcomingAssessments}
                >
                    Tap to retry
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView 
                style={{ flex: 1, margin: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[Colors[theme].tint]}
                        tintColor={Colors[theme].tint}
                    />
                }
            >
                <ThemedText type="title" style={{ marginBottom: 20 }}>
                    Upcoming Assessments
                </ThemedText>

                {componentData.map((classData) => (
                    <UpcomingAssessmentCard
                        key={classData.classId}
                        classTitle={classData.classTitle}
                        classCode={classData.classCode}
                        assessments={classData.assessments}
                        onAssessmentPress={handleAssessmentPress}
                    />
                ))}

                {componentData.length === 0 && (
                    <ThemedView isCard={true} style={{ padding: 20, alignItems: 'center' }}>
                        <ThemedText type="default" style={{ opacity: 0.7 }}>
                            No upcoming assessments
                        </ThemedText>
                    </ThemedView>
                )}
            </ScrollView>
        </ThemedView>
    );
}