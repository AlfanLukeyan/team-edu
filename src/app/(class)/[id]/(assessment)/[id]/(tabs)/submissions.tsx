import SubmissionActionsMenu from "@/components/SubmissionActionsMenu";
import { SubmissionCard } from "@/components/SubmissionCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAssessment } from "@/contexts/AssessmentContext";
import { useHeader } from "@/contexts/HeaderContext"; // ✅ Add this import
import { useUserRole } from "@/hooks/useUserRole";
import { assessmentService } from "@/services/assessmentService";
import { AssessmentSubmission } from "@/types/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function SubmissionsScreen() {

    const { isStudent } = useUserRole(); // ✅ Add role check
    const router = useRouter(); // ✅ Add router

    // ✅ Early return for students - prevent any API calls
    useEffect(() => {
        if (isStudent()) {
            console.log('🚫 Student accessing questions tab - redirecting');
            router.replace('../'); // Redirect to about tab
        }
    }, [isStudent, router]);
    // ✅ Remove navigation hook and add header context
    const { setHeaderConfig, resetHeader } = useHeader();
    const theme = useColorScheme();
    const { assessmentId } = useAssessment();

    const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
    const [selectedSubmissionIds, setSelectedSubmissionIds] = useState<string[]>([]);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async () => {
        if (!assessmentId) return;

        try {
            setError(null);
            const data = await assessmentService.getAssessmentSubmissions(assessmentId);
            setSubmissions(data);
        } catch (err) {
            setError('Failed to load submissions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [assessmentId]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchSubmissions();
        setRefreshing(false);
    }, [fetchSubmissions]);

    // ✅ Memoize the header component
    const headerRightComponent = useMemo(() => {
        if (selectedSubmissionIds.length === 0) return null;

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                    onPress={() => setSelectedSubmissionIds([])}
                    style={{ padding: 8 }}
                >
                    <Text style={{ color: Colors[theme ?? 'light'].tint }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setShowActionsMenu(!showActionsMenu)}
                    style={{ padding: 8 }}
                >
                    <Ionicons
                        name="ellipsis-horizontal"
                        size={20}
                        color={Colors[theme ?? 'light'].tint}
                    />
                </TouchableOpacity>
            </View>
        );
    }, [selectedSubmissionIds.length, showActionsMenu, theme]);

    // ✅ Use header context instead of useLayoutEffect
    useEffect(() => {
        if (selectedSubmissionIds.length > 0) {
            setHeaderConfig({
                title: `${selectedSubmissionIds.length} selected`,
                rightComponent: headerRightComponent
            });
        } else {
            resetHeader();
        }
    }, [selectedSubmissionIds.length, headerRightComponent, setHeaderConfig, resetHeader]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    // ✅ Update useFocusEffect to use header context
    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedSubmissionIds([]);
                setShowActionsMenu(false);
                resetHeader(); // ✅ Use resetHeader instead of navigation.setOptions
            };
        }, [resetHeader])
    );

    // ✅ Remove the entire useLayoutEffect block

    const handleSelectAllSubmissions = () => {
        const allSubmissionIds = submissions.filter(s => s.id).map(s => s.id!);
        setSelectedSubmissionIds(allSubmissionIds);
        setShowActionsMenu(false);
    };

    const handleDeleteSubmissions = () => {
        const selectedSubmissions = submissions.filter(s => s.id && selectedSubmissionIds.includes(s.id));
        const submissionNames = selectedSubmissions.map(s => s.username).join(', ');

        Alert.alert(
            "Delete Submissions",
            `Are you sure you want to delete ${selectedSubmissionIds.length} submission(s) from: ${submissionNames}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setSubmissions(submissions.filter(submission => !submission.id || !selectedSubmissionIds.includes(submission.id)));
                        setSelectedSubmissionIds([]);
                        setShowActionsMenu(false);
                    }
                }
            ]
        );
    };

    const handleSubmissionLongPress = (id: string) => {
        setSelectedSubmissionIds([id]);
        setShowActionsMenu(false);
    };

    const handleSubmissionPress = (id: string) => {
        if (selectedSubmissionIds.length > 0) {
            if (selectedSubmissionIds.includes(id)) {
                setSelectedSubmissionIds(selectedSubmissionIds.filter(submissionId => submissionId !== id));
            } else {
                setSelectedSubmissionIds([...selectedSubmissionIds, id]);
            }
            setShowActionsMenu(false);
        } else {

        }
    };

    if (loading) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors[theme ?? 'light'].tint} />
                <ThemedText style={{ marginTop: 16 }}>Loading submissions...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <ThemedText style={{ textAlign: 'center', marginBottom: 16 }}>
                    {error}
                </ThemedText>
                <ThemedText
                    style={{ color: Colors[theme ?? 'light'].tint, textAlign: 'center' }}
                    onPress={fetchSubmissions}
                >
                    Tap to retry
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <SubmissionActionsMenu
                visible={showActionsMenu && selectedSubmissionIds.length > 0}
                onClose={() => setShowActionsMenu(false)}
                onDelete={() => handleDeleteSubmissions()}
                onSelectAll={() => handleSelectAllSubmissions()}
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[Colors[theme ?? 'light'].tint]}
                        tintColor={Colors[theme ?? 'light'].tint}
                    />
                }
            >
                {submissions.length === 0 ? (
                    <ThemedView style={styles.emptyState}>
                        <ThemedText style={styles.emptyText}>
                            No submissions available yet
                        </ThemedText>
                    </ThemedView>
                ) : (
                    <View style={styles.submissionsList}>
                        {submissions.map((item, index) => {
                            const submissionId = item.id || `${item.user_user_id}-${index}`;

                            return (
                                <SubmissionCard
                                    key={submissionId}
                                    id={submissionId}
                                    user_profile_url={`http://20.2.83.17:5002/storage/user_profile_pictures/${item.user_user_id}.jpg`}
                                    user_name={item.username}
                                    user_id={item.user_user_id}
                                    time_remaining={item.time_remaining ? item.time_remaining : undefined}
                                    status={item.status}
                                    score={item.score}
                                    total_score={100}
                                    isSelected={selectedSubmissionIds.includes(submissionId)}
                                    onLongPress={(id: string) => {
                                        handleSubmissionLongPress(id);
                                    }}
                                    onPress={(id: string) => {
                                        handleSubmissionPress(id);
                                    }}
                                />
                            );
                        })}
                    </View>
                )}
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
        gap: 8,
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 20,
    },
    emptyText: {
        opacity: 0.7,
        textAlign: 'center',
    },
});