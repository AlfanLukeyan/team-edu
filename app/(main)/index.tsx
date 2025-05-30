import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UpcomingAssessmentCard } from "@/components/UpcomingAssessmentCard";
import { response } from "@/data/response";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function HomeScreen() {
    const router = useRouter();
    const [upcomingAssessments, setUpcomingAssessments] = useState(response.getUpcomingAssessmentsByClass.data);

    const handleAssessmentPress = (assessment: any) => {
        console.log("Assessment pressed:", assessment);

        router.push({
            pathname: "/(assessment)/(tabs)",
            params: { id: assessment.id }
        });
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, margin: 16 }}>
                <ThemedText type="title" style={{ marginBottom: 20 }}>
                    Upcoming Assessments
                </ThemedText>

                {upcomingAssessments.map((classData) => (
                    <UpcomingAssessmentCard
                        key={classData.class_id}
                        classData={classData}
                        onAssessmentPress={handleAssessmentPress}
                    />
                ))}

                {upcomingAssessments.length === 0 && (
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