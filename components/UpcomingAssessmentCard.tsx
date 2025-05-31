import { Colors } from "@/constants/Colors";
import { ComponentAssessment } from "@/types/api";
import { formatDate } from "@/utils/utils";
import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { AssessmentCard } from "./AssessmentCard";
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

    const getDaysRemainingText = (daysRemaining: number) => {
        if (daysRemaining === 0) return "Today";
        if (daysRemaining === 1) return "Tomorrow";
        return `${daysRemaining} days`;
    };

    return (
        <ThemedView isCard={true} style={styles.container}>
            {/* Class Info Header */}
            <View style={styles.classInfo}>
                <ThemedText type="subtitle">
                    {classCode}
                </ThemedText>
                <ThemedText type='defaultSemiBold' style={styles.classTitle}>
                    {classTitle}
                </ThemedText>
            </View>

            {/* Assessment List */}
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
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        marginBottom: 8,
        padding: 14,
    },
    classInfo: {
        marginBottom: 8,
    },
    classTitle: {
        marginTop: 2,
    },
    assessmentsList: {
        flex: 1,
    },
    separator: {
        height: 1,
        marginVertical: 8,
        opacity: 0.3,
    },
});