import { ClassCard } from "@/components/ClassCard";
import { SearchBar } from "@/components/SearchBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useUserRole } from "@/hooks/useUserRole";
import { classService } from "@/services/classService";
import { ModalEmitter } from "@/services/modalEmitter";
import { AdminClass, Class, PaginationInfo } from "@/types/api";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";

export default function ClassesScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const { isAdmin } = useUserRole();

    const [classes, setClasses] = useState<(Class | AdminClass)[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingClassId, setDeletingClassId] = useState<string | null>(null);

    // Search states
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const fetchClasses = async (page: number = 1, append: boolean = false, search?: string) => {
        try {
            setError(null);
            if (!append) setLoading(true);

            if (isAdmin()) {
                const { classes: classesData, pagination: paginationData } = await classService.getAdminClasses({
                    page,
                    per_page: 10,
                    search: search || undefined
                });

                if (append) {
                    setClasses(prev => [...prev, ...classesData]);
                } else {
                    setClasses(classesData);
                }
                setPagination(paginationData);
                setCurrentPage(page);
            } else {
                const classesData = await classService.getClasses();
                setClasses(classesData);
                setPagination(null);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setIsSearching(false);
        }
    };

    const refetchClasses = async () => {
        try {
            setRefreshing(true);
            setCurrentPage(1);
            await fetchClasses(1, false, searchQuery);
        } catch (err: any) {
            setError(err.message || 'Failed to refresh classes');
        } finally {
            setRefreshing(false);
        }
    };

    const loadMoreClasses = useCallback(async () => {
        if (!isAdmin() || !pagination || loadingMore || currentPage >= pagination.max_page) {
            return;
        }

        setLoadingMore(true);
        const nextPage = currentPage + 1;
        await fetchClasses(nextPage, true, searchQuery);
    }, [isAdmin, pagination, loadingMore, currentPage, searchQuery]);

    // Search functionality
    const handleSearch = useCallback(async (query: string) => {
        if (!isAdmin()) return;

        setSearchQuery(query);
        setIsSearching(true);
        setCurrentPage(1);
        await fetchClasses(1, false, query);
    }, [isAdmin]);

    const toggleSearch = useCallback(() => {
        setShowSearch(!showSearch);
        if (showSearch && searchQuery) {
            // Clear search when hiding search bar
            setSearchQuery('');
            handleSearch('');
        }
    }, [showSearch, searchQuery, handleSearch]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        handleSearch('');
    }, [handleSearch]);

    // Class actions handlers
    const handleEditClass = useCallback((classId: string) => {
        console.log('Edit class:', classId);

        ModalEmitter.showAlert({
            title: "Edit Class",
            message: "Edit class functionality will be implemented soon.",
            type: "info",
            confirmText: "OK",
            cancelText: "", // Hide cancel button
            onConfirm: () => {
                ModalEmitter.hideAlert();
            },
            onCancel: () => {
                ModalEmitter.hideAlert();
            }
        });
    }, []);

    const handleDeleteClass = useCallback((classId: string) => {
        const classToDelete = classes.find(cls => cls.id === classId);
        const className = classToDelete ? classToDelete.name : 'this class';

        ModalEmitter.showAlert({
            title: "Delete Class",
            message: `Are you sure you want to delete "${className}"? This action cannot be undone.`,
            type: "danger",
            confirmText: "Delete",
            cancelText: "Cancel",
            onConfirm: () => {
                ModalEmitter.hideAlert();
                confirmDeleteClass(classId);
            },
            onCancel: () => {
                ModalEmitter.hideAlert();
            }
        });
    }, [classes]);

    const confirmDeleteClass = async (classId: string) => {
        try {
            setDeletingClassId(classId);

            const response = await classService.deleteClass(classId);

            // Check if deletion was successful
            if (response.status === 'success') {
                // Remove the deleted class from the local state
                setClasses(prev => prev.filter(cls => cls.id !== classId));

                // Update pagination count if available
                if (pagination) {
                    setPagination(prev => prev ? {
                        ...prev,
                        count: Math.max(0, prev.count - 1)
                    } : null);
                }

                ModalEmitter.showSuccess(
                    response.message || "Class deleted successfully."
                );
            } else {
                throw new Error(response.message || 'Failed to delete class');
            }
        } catch (error: any) {
            console.error('Delete class error:', error);
            ModalEmitter.showError(
                error.message || "Failed to delete class. Please try again."
            );
        } finally {
            setDeletingClassId(null);
        }
    };

    // Set up header right component for search
    useLayoutEffect(() => {
        if (isAdmin()) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        onPress={toggleSearch}
                        style={styles.headerSearchButton}
                    >
                        <Ionicons
                            name={showSearch ? "close" : "search"}
                            size={20}
                            color={Colors[colorScheme ?? 'light'].text}
                        />
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, isAdmin, showSearch, toggleSearch, colorScheme]);

    // Clean up header on unmount
    useFocusEffect(
        useCallback(() => {
            return () => {
                setShowSearch(false);
                setSearchQuery('');
            };
        }, [])
    );

    useEffect(() => {
        fetchClasses();
    }, []);

    const renderClassItem = ({ item }: { item: Class | AdminClass }) => (
        <ClassCard
            key={item.id}
            title={item.name || 'Untitled Class'}
            classCode={'tag' in item ? item.tag || 'No Code' : 'No Code'}
            description={item.description || 'No description available'}
            onPress={() => {
                router.push(`/(class)/${item.id}/(tabs)`);
            }}
            // Only show actions for admin users
            showActions={isAdmin()}
            onEdit={() => handleEditClass(item.id)}
            onDelete={() => handleDeleteClass(item.id)}
            // Show loading state for the class being deleted
            isDeleting={deletingClassId === item.id}
        />
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
                <ThemedText style={styles.loadingText}>Loading more classes...</ThemedText>
            </View>
        );
    };

    const renderEmptyState = () => (
        <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
                {searchQuery ? 'No classes found for your search' : 'No classes found'}
            </ThemedText>
            <ThemedText style={styles.emptySubText}>
                {searchQuery ? 'Try adjusting your search terms' : 'Pull down to refresh or check back later'}
            </ThemedText>
        </ThemedView>
    );

    if (loading && classes.length === 0) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <FlatList
                data={classes}
                renderItem={renderClassItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <SearchBar
                        visible={isAdmin() && showSearch}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        onClear={clearSearch}
                        placeholder="Search classes..."
                        loading={isSearching}
                    />
                }
                contentContainerStyle={[
                    styles.container,
                    classes.length === 0 && { flex: 1 }
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refetchClasses}
                    />
                }
                onEndReached={isAdmin() ? loadMoreClasses : undefined}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={renderEmptyState}
                ListFooterComponent={renderFooter}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubText: {
        opacity: 0.7,
        textAlign: 'center',
    },
    footerLoader: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        opacity: 0.7,
        fontSize: 14,
    },
    // Header search button
    headerSearchButton: {
        padding: 8,
        paddingRight: 24,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});