import { Colors } from "@/constants/Colors";
import { ComponentAssessment } from "@/types/api";
import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { AssessmentCard } from "./AssesmentCard";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface UpcomingAssessmentCardProps {
    classTitle: string;
    classCode: string;
    assessments: ComponentAssessment[];
    onAssessmentPress?: (assessment: ComponentAssessment) => void;
}

export function UpcomingAssessmentCard({ 
    classTitle, 
    classCode, 
    assessments, 
    onAssessmentPress 
}: UpcomingAssessmentCardProps) {
    const theme = useColorScheme();
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDaysRemainingText = (daysRemaining: number) => {
        if (daysRemaining === 0) return "Today";
        if (daysRemaining === 1) return "Tomorrow";
        return `${daysRemaining} days`;
    };

    return (
        <ThemedView isCard={true} style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.classInfo}>
                    <ThemedText type="subtitle">
                        {classCode}
                    </ThemedText>
                    <ThemedText type='defaultSemiBold' style={styles.classTitle}>
                        {classTitle}
                    </ThemedText>
                </View>

                <View style={styles.assessmentsList}>
                    {assessments.map((assessment, index) => (
                        <View key={assessment.id}>
                            <AssessmentCard
                                title={assessment.title}
                                startDate={formatDate(assessment.start_date)}
                                endDate={getDaysRemainingText(assessment.days_remaining)}
                                onPress={() => onAssessmentPress?.(assessment)}
                            />
                            {index < assessments.length - 1 && (
                                <View style={[
                                    styles.separator,
                                    { backgroundColor: Colors[theme ?? 'light'].border }
                                ]} />
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        marginBottom: 8,
        padding: 14,
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    classInfo: {
        flex: 1,
        marginRight: 8,
        justifyContent: 'flex-start',
    },
    classTitle: {
        marginBottom: 4,
    },
    assessmentsList: {
        flex: 2,
    },
    separator: {
        height: 1,
        marginVertical: 8,
        opacity: 0.3,
    },
});