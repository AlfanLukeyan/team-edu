import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { CompletedCountCard } from "@/components/CompletedCountCard";
import { DueDateCard } from "@/components/DueDateCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TimeRemainingCard } from "@/components/TimeRemainingCard";
import { response } from "@/data/response";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AboutAssessmentScreen() {
    const params = useLocalSearchParams();
    const assessmentId = params.id as string;
    const router = useRouter();

    useEffect(() => {
        console.log('AboutAssessmentScreen mounted with params:', params)
    }, [params])


    let assessment = response.getAllAssessments.data.find(
        (item) => item.id === assessmentId
    );

    if (!assessment) {
        for (const classObj of response.getUpcomingAssessmentsByClass.data) {
            const found = classObj.assessments.find((item) => item.id === assessmentId);
            if (found) {
                assessment = { ...found, class_id: classObj.class_id };
                break;
            }
        }
    }

    if (!assessment) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Assessment not found</ThemedText>
            </ThemedView>
        );
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const dateOptions: Intl.DateTimeFormatOptions = {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        };

        return {
            date: date.toLocaleDateString("en-US", dateOptions),
            time: date.toLocaleTimeString("en-US", timeOptions)
        };
    };

    const startDateTime = formatDateTime(assessment.start_date);
    const endDateTime = formatDateTime(assessment.end_date);

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ gap: 14 }}>
                    <ThemedText type="title">{assessment.title}</ThemedText>
                    <ThemedText type="default">
                        Description: {assessment.description}
                    </ThemedText>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 12,
                        }}
                    >
                        <DueDateCard
                            startTime={startDateTime.time}
                            startDate={startDateTime.date}
                            endTime={endDateTime.time}
                            endDate={endDateTime.date}
                            style={{ flex: 1 }}
                        />
                        <CompletedCountCard comletedCount={20} totalCount={13} style={{ flex: 1 }} />
                    </View>
                    <View>
                        <TimeRemainingCard timeRemaining={assessment.duration} />
                    </View>
                    <ButtonWithDescription
                        onPress={() => {
                            router.push({
                                pathname: "/(assessment)/session",
                                params: {
                                    id: assessment.id,
                                },
                            })
                        }}
                        description="Please ensure that you are prepared to take the assessment."
                    >
                        Start
                    </ButtonWithDescription>
                </View>
            </ScrollView>
        </ThemedView>
    );
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
});