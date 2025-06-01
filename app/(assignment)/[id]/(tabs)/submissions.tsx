import { AssignmentSubmissionCard } from '@/components/AssignmentSubmissionCard'
import { ThemedView } from '@/components/ThemedView'
import { response } from '@/data/response'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native'

const AssignmentSubmissionsScreen = () => {
    const params = useLocalSearchParams();
    const assignmentId = params.id as string;
    const navigation = useNavigation('/(assignment)');
    const theme = useColorScheme();

    useEffect(() => {
        console.log('AssignmentSubmissionsScreen mounted with params:', params)
    }
    , [params])

    const [submissions, setSubmissions] = useState(response.getAllAssignmentSubmissions.data);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
    const [showActionsMenu, setShowActionsMenu] = useState(false);

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.submissionsList}>
                    {submissions.map((submission) => (
                        <AssignmentSubmissionCard
                            key={submission.id}
                            id={submission.id}
                            user_profile_url={submission.user_profile_url}
                            user_name={submission.user_name}
                            user_id={submission.user_id}
                            status={submission.status}
                            score={submission.score}
                            submitted_at={submission.submitted_at}
                            file_name={submission.file_name}
                            file_url={submission.file_url}
                            isSelected={selectedQuestionIds.includes(submission.id)}
                            />
                    ))}
                </View>
            </ScrollView>
        </ThemedView>
    )
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
        gap: 8,
    },
});

export default AssignmentSubmissionsScreen