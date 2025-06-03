import { ClassCard } from "@/components/ClassCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useUserRole } from "@/hooks/useUserRole";
import { classService } from "@/services/classService";
import { AdminClass, Class, PaginationInfo } from "@/types/api";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

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

    const renderSearchHeader = () => {
        if (!isAdmin() || !showSearch) return null;

        return (
            <View style={styles.searchContainer}>
                <View style={[
                    styles.searchInputContainer,
                    { 
                        backgroundColor: Colors[colorScheme ?? 'light'].background,
                        borderColor: Colors[colorScheme ?? 'light'].border 
                    }
                ]}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={Colors[colorScheme ?? 'light'].icon}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={[
                            styles.searchInput,
                            { color: Colors[colorScheme ?? 'light'].text }
                        ]}
                        placeholder="Search classes..."
                        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={Colors[colorScheme ?? 'light'].icon}
                            />
                        </TouchableOpacity>
                    )}
                    {isSearching && (
                        <ActivityIndicator
                            size="small"
                            color={Colors[colorScheme ?? 'light'].tint}
                            style={styles.searchLoader}
                        />
                    )}
                </View>
            </View>
        );
    };

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
                ListHeaderComponent={renderSearchHeader}
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
    // Search container styles
    searchContainer: {
        paddingHorizontal: 0,
        paddingBottom: 16,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 4,
    },
    clearButton: {
        marginLeft: 8,
        padding: 4,
    },
    searchLoader: {
        marginLeft: 8,
    },
});