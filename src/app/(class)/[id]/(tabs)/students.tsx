import AddMemberBottomSheet, { AddMemberBottomSheetRef } from '@/components/AddMemberBottomSheet';
import { Button } from '@/components/Button';
import MemberActionsMenu from '@/components/MemberActionsMenu';
import { StudentCard } from '@/components/StudentCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useClass } from '@/contexts/ClassContext';
import { useHeader } from '@/contexts/HeaderContext';
import { useUserRole } from '@/hooks/useUserRole';
import { classService } from '@/services/classService';
import { ModalEmitter } from '@/services/modalEmitter';
import { ClassMember } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

const StudentsScreen = () => {
    const { classId } = useClass();
    const { isAdmin } = useUserRole();
    const { setHeaderConfig, resetHeader } = useHeader();
    const theme = useColorScheme();
    const apiURL = process.env.EXPO_PUBLIC_API_URL;

    const [members, setMembers] = useState<ClassMember[]>([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addMemberBottomSheetRef = useRef<AddMemberBottomSheetRef>(null);

    const fetchClassMembers = async () => {
        if (!classId) {
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const data = await classService.getClassMembers(classId);
            const students = data.filter(member => member.role === 'student');
            setMembers(students);
        } catch (err) {
            setError('Failed to load class members');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchClassMembers();
        setRefreshing(false);
    };

    const handleAddMembers = () => {
        if (!classId) return;
        addMemberBottomSheetRef.current?.open(classId);
    };

    const handleMembersAdded = async (addedCount: number) => {
        ModalEmitter.showSuccess(`Successfully added ${addedCount} student(s) to the class!`);
        await fetchClassMembers();
    };

    // Header right component for selection mode
    const headerRightComponent = useMemo(() => {
        if (selectedMemberIds.length === 0 || !isAdmin()) return null;

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                    onPress={() => setSelectedMemberIds([])}
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
    }, [selectedMemberIds.length, showActionsMenu, theme, isAdmin]);

    // Update header when selection changes
    useEffect(() => {
        if (selectedMemberIds.length > 0 && isAdmin()) {
            setHeaderConfig({
                title: `${selectedMemberIds.length} selected`,
                rightComponent: headerRightComponent
            });
        } else {
            resetHeader();
        }
    }, [selectedMemberIds.length, isAdmin, headerRightComponent, setHeaderConfig, resetHeader]);

    // Long press handler
    const handleMemberLongPress = useCallback((userId: string) => {
        if (isAdmin()) {
            setSelectedMemberIds([userId]);
            setShowActionsMenu(false);
        }
    }, [isAdmin]);

    // Press handler
    const handleMemberPress = useCallback((userId: string) => {
        if (selectedMemberIds.length > 0 && isAdmin()) {
            if (selectedMemberIds.includes(userId)) {
                setSelectedMemberIds(selectedMemberIds.filter(id => id !== userId));
            } else {
                setSelectedMemberIds([...selectedMemberIds, userId]);
            }
            setShowActionsMenu(false);
        }
        // For regular press, you can add navigation to member profile if needed
    }, [selectedMemberIds, isAdmin]);

    // Select all members
    const handleSelectAllMembers = useCallback(() => {
        const allMemberIds = members.map(member => member.user_user_id);
        setSelectedMemberIds(allMemberIds);
        setShowActionsMenu(false);
    }, [members]);

    // Delete selected members
    const handleDeleteMembers = useCallback(() => {
        const selectedMembers = members.filter(m => selectedMemberIds.includes(m.user_user_id));
        const memberNames = selectedMembers.map(m => m.username).join(', ');

        ModalEmitter.showAlert({
            title: "Remove Students",
            message: `Are you sure you want to remove ${selectedMemberIds.length} student(s) from the class?\n\nStudents: ${memberNames}`,
            confirmText: "Remove",
            cancelText: "Cancel",
            type: "danger",
            onConfirm: async () => {
                if (!classId) return;

                try {
                    // Delete members one by one (if your API doesn't support bulk delete)
                    for (const userId of selectedMemberIds) {
                        await classService.deleteClassMember(userId, classId);
                    }

                    // Update local state
                    setMembers(members.filter(member =>
                        !selectedMemberIds.includes(member.user_user_id)
                    ));
                    setSelectedMemberIds([]);
                    setShowActionsMenu(false);

                    ModalEmitter.showSuccess(`Successfully removed ${selectedMemberIds.length} student(s) from the class`);
                } catch (error) {
                    ModalEmitter.showError("Failed to remove students. Please try again.");
                    console.error('Failed to delete members:', error);
                    // Refresh the list in case of partial success
                    await fetchClassMembers();
                }
            },
            onCancel: () => {
                setShowActionsMenu(false);
            }
        });
    }, [selectedMemberIds, members, classId]);
    
    // Clean up selection when leaving screen
    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedMemberIds([]);
                setShowActionsMenu(false);
                resetHeader();
            };
        }, [resetHeader])
    );

    useEffect(() => {
        if (classId) {
            fetchClassMembers();
        }
    }, [classId]);

    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText}>Loading students...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={styles.centered}>
                <ThemedText style={styles.errorText}>
                    {error}
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            {/* Member Actions Menu */}
            {isAdmin() && (
                <MemberActionsMenu
                    visible={showActionsMenu && selectedMemberIds.length > 0}
                    onClose={() => setShowActionsMenu(false)}
                    onDelete={handleDeleteMembers}
                    onSelectAll={handleSelectAllMembers}
                    selectedCount={selectedMemberIds.length}
                />
            )}

            {/* Header with Add Member button for admins */}
            {isAdmin() && selectedMemberIds.length === 0 && (
                <View style={styles.header}>
                    <Button
                        onPress={handleAddMembers}
                        icon={{ name: "person.badge.plus.fill", size: 16 }}
                    >
                        Add Members
                    </Button>
                </View>
            )}

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                {members.length === 0 ? (
                    <ThemedView style={styles.emptyState}>
                        <Ionicons name="people-outline" size={48} color="#666" />
                        <ThemedText style={styles.emptyText}>
                            No students found in this class
                        </ThemedText>
                    </ThemedView>
                ) : (
                    members.map((student) => (
                        <StudentCard
                            key={student.user_user_id}
                            user_id={student.user_user_id}
                            user_name={student.username}
                            user_profile_url={`${apiURL}/${student.photo_url}`}
                            onPress={() => handleMemberPress(student.user_user_id)}
                            onLongPress={isAdmin() ? () => handleMemberLongPress(student.user_user_id) : undefined}
                            isSelected={selectedMemberIds.includes(student.user_user_id)}
                        />
                    ))
                )}
            </ScrollView>

            {/* Add Member Bottom Sheet */}
            <AddMemberBottomSheet
                ref={addMemberBottomSheetRef}
                onMembersAdded={handleMembersAdded}
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    scrollView: {
        flex: 1,
        borderRadius: 15,
        margin: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    loadingText: {
        marginTop: 12,
        opacity: 0.7,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 20,
        gap: 16,
    },
    emptyText: {
        opacity: 0.7,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default StudentsScreen;