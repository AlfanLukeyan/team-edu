import { ClassCard } from "@/components/ClassCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUserRole } from "@/hooks/useUserRole";
import { classService } from "@/services/classService";
import { AdminClass, Class, PaginationInfo } from "@/types/api";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, useColorScheme, View } from "react-native";

export default function ClassesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { isAdmin } = useUserRole();

    const [classes, setClasses] = useState<(Class | AdminClass)[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchClasses = async (page: number = 1, append: boolean = false) => {
        try {
            setError(null);
            if (!append) setLoading(true);

            if (isAdmin()) {
                const { classes: classesData, pagination: paginationData } = await classService.getAdminClasses({
                    page,
                    per_page: 10
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
        }
    };

    const refetchClasses = async () => {
        try {
            setRefreshing(true);
            setCurrentPage(1);
            await fetchClasses(1, false);
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
        await fetchClasses(nextPage, true);
    }, [isAdmin, pagination, loadingMore, currentPage]);

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
                No classes found
            </ThemedText>
            <ThemedText style={styles.emptySubText}>
                Pull down to refresh or check back later
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
});
