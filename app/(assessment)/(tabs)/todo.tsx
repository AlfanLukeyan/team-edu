import { SubmissionCard } from "@/components/SubmissionCard";
import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function TodoScreen() {
    const params = useLocalSearchParams();
    const assessmentId = params.id as string;

    const [submissions, setSubmissions] = useState(response.getAllTodo.data);

    useEffect(() => {
        console.log('TodoScreen mounted with params:', params)
    }, [params])

    const handleDeleteSubmission = (id: string) => {
        setSubmissions(submissions.filter(submission => submission.id !== id));
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.todoList}>
                    {submissions.map((submission) => (
                        <SubmissionCard
                            key={submission.id}
                            id={submission.id}
                            user_profile_url={submission.user_profile_url}
                            user_name={submission.user_name}
                            user_id={submission.user_id}
                            time_remaining={submission.time_remaining ?? undefined}
                            status={submission.status}
                            score={submission.score ?? undefined}
                            total_score={submission.total_score ?? undefined}
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
    },
    todoList: {
        gap: 8,
        paddingVertical: 8,
    },
});