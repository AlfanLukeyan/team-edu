import SubmissionActionsMenu from "@/components/SubmissionActionsMenu";
import { SubmissionCard } from "@/components/SubmissionCard";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { response } from "@/data/response";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function SubmissionsScreen() {
    const params = useLocalSearchParams();
    const assessmentId = params.id as string;
    const navigation = useNavigation('/(assessment)');
    const theme = useColorScheme();

    const [submissions, setSubmissions] = useState(response.getAllSubmissions.data);
    const [selectedSubmissionIds, setSelectedSubmissionIds] = useState<string[]>([]);
    const [showActionsMenu, setShowActionsMenu] = useState(false);

    useEffect(() => {
        console.log('SubmissionsScreen mounted with params:', params)
    }, [params])

    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedSubmissionIds([]);
                setShowActionsMenu(false);
                navigation.setOptions({
                    headerTitle: undefined,
                    headerRight: undefined,
                });
            };
        }, [navigation])
    );

    useLayoutEffect(() => {
        if (selectedSubmissionIds.length > 0) {
            navigation.setOptions({
                headerTitle: `${selectedSubmissionIds.length} selected`,
                headerRight: () => (
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
                ),
            });
        } else {
            navigation.setOptions({
                headerTitle: undefined,
                headerRight: undefined,
            });
        }
    }, [selectedSubmissionIds, showActionsMenu, navigation, theme]);

    const handleSelectAllSubmissions = () => {
        const allSubmissionIds = submissions.map(submission => submission.id);
        setSelectedSubmissionIds(allSubmissionIds);
        setShowActionsMenu(false);
    };

    const handleDeleteSubmissions = () => {
        const selectedSubmissions = submissions.filter(s => selectedSubmissionIds.includes(s.id));
        const submissionNames = selectedSubmissions.map(s => s.user_name).join(', ');

        Alert.alert(
            "Delete Submissions",
            `Are you sure you want to delete ${selectedSubmissionIds.length} submission(s) from: ${submissionNames}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setSubmissions(submissions.filter(submission => !selectedSubmissionIds.includes(submission.id)));
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
            console.log("Normal press on submission:", id);
        }
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
            <SubmissionActionsMenu
                visible={showActionsMenu && selectedSubmissionIds.length > 0}
                onClose={() => setShowActionsMenu(false)}
                onDelete={() => handleDeleteSubmissions()}
                onSelectAll={() => handleSelectAllSubmissions()}
            />

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
                            isSelected={selectedSubmissionIds.includes(item.id)}
                            onLongPress={handleSubmissionLongPress}
                            onPress={handleSubmissionPress}
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
        gap: 8,
    },
});