import { SubmissionCard } from "@/components/SubmissionCard";
import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function SubmissionsScreen() {
    const params = useLocalSearchParams();
    const assessmentId = params.id as string;

    const [submissions, setSubmissions] = useState(response.getAllSubmissions.data);

    useEffect(() => {
        console.log('SubmissionsScreen mounted with params:', params)
    }, [params])

    const handleDeleteSubmission = (id: string) => {
        setSubmissions(submissions.filter(submission => submission.id !== id));
    };

    type Submission = {
        id: string;
        user_profile_url: string;
        user_name: string;
        user_id: string;
        time_remaining: number;
        status: string;
        score: number;
        total_score: number;
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.submissionsList}>
                    {submissions.map((item) => (
                        <SubmissionCard
                            key={item.id}
                            id={item.id}
                            user_profile_url={item.user_profile_url}
                            user_name={item.user_name}
                            user_id={item.user_id}
                            time_remaining={item.time_remaining}
                            status={item.status}
                            score={item.score}
                            total_score={item.total_score}
                            onDelete={handleDeleteSubmission}
                        />
                    ))}
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
    },
    submissionsList: {
        gap: 14,
    },
});