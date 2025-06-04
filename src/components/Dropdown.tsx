import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export interface DropdownItem {
    label: string;
    value: string;
    disabled?: boolean;
}

interface DropdownProps {
    items: DropdownItem[];
    selectedValue?: string;
    onSelect: (item: DropdownItem) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    loading?: boolean;
    searchable?: boolean;
    maxHeight?: number;
    renderItem?: (item: DropdownItem, isSelected: boolean) => React.ReactNode;
    error?: string;
    style?: any;
}

export function Dropdown({
    items,
    selectedValue,
    onSelect,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    disabled = false,
    loading = false,
    searchable = true,
    maxHeight = 300,
    renderItem,
    error,
    style
}: DropdownProps) {
    const theme = useColorScheme() ?? "light";
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const selectedItem = useMemo(() => {
        return items.find(item => item.value === selectedValue);
    }, [items, selectedValue]);

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;

        return items.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [items, searchQuery]);

    const handleOpen = useCallback(() => {
        if (!disabled && !loading) {
            setIsOpen(true);
            setSearchQuery("");
        }
    }, [disabled, loading]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setSearchQuery("");
    }, []);

    const handleSelect = useCallback((item: DropdownItem) => {
        if (item.disabled) return;

        onSelect(item);
        handleClose();
    }, [onSelect, handleClose]);

    const defaultRenderItem = useCallback((item: DropdownItem, isSelected: boolean) => (
        <View style={[
            styles.dropdownItem,
            {
                backgroundColor: isSelected
                    ? Colors[theme].tint + '20'
                    : 'transparent'
            },
            item.disabled && styles.disabledItem
        ]}>
            <ThemedText
                style={[
                    styles.dropdownItemText,
                    isSelected && { color: Colors[theme].tint },
                    item.disabled && { opacity: 0.5 }
                ]}
                numberOfLines={1}
            >
                {item.label}
            </ThemedText>
            {isSelected && (
                <Ionicons
                    name="checkmark"
                    size={20}
                    color={Colors[theme].tint}
                />
            )}
        </View>
    ), [theme]);

    const renderDropdownItem = ({ item }: { item: DropdownItem }) => {
        const isSelected = item.value === selectedValue;

        return (
            <TouchableOpacity
                onPress={() => handleSelect(item)}
                disabled={item.disabled}
                style={styles.dropdownItemContainer}
            >
                {renderItem ? renderItem(item, isSelected) : defaultRenderItem(item, isSelected)}
            </TouchableOpacity>
        );
    };

    return (
        <>
            <TouchableOpacity
                onPress={handleOpen}
                disabled={disabled || loading}
                style={[
                    styles.dropdown,
                    {
                        backgroundColor: Colors[theme].background,
                        borderColor: error ? '#FF3B30' : Colors[theme].border,
                    },
                    (disabled || loading) && styles.disabledDropdown,
                    style
                ]}
            >
                <View style={styles.dropdownContent}>
                    <ThemedText
                        style={[
                            styles.dropdownText,
                            !selectedItem && styles.placeholderText
                        ]}
                        numberOfLines={1}
                    >
                        {selectedItem ? selectedItem.label : placeholder}
                    </ThemedText>

                    {loading ? (
                        <ActivityIndicator size="small" color={Colors[theme].text} />
                    ) : (
                        <Ionicons
                            name={isOpen ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={Colors[theme].text}
                        />
                    )}
                </View>
            </TouchableOpacity>

            {error && (
                <ThemedText style={styles.errorText}>
                    {error}
                </ThemedText>
            )}

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={handleClose}
            >
                <Pressable style={styles.modalOverlay} onPress={handleClose}>
                    <ThemedView style={[
                        styles.dropdownModal,
                        {
                            backgroundColor: Colors[theme].background,
                            borderColor: Colors[theme].border,
                            maxHeight: maxHeight + (searchable ? 60 : 0)
                        }
                    ]}>
                        {searchable && (
                            <View style={[
                                styles.searchContainer,
                                { borderBottomColor: Colors[theme].border }
                            ]}>
                                <Ionicons
                                    name="search"
                                    size={20}
                                    color={Colors[theme].icon}
                                    style={styles.searchIcon}
                                />
                                <TextInput
                                    style={[
                                        styles.searchInput,
                                        { color: Colors[theme].text }
                                    ]}
                                    placeholder={searchPlaceholder}
                                    placeholderTextColor={Colors[theme].icon}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoFocus
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity
                                        onPress={() => setSearchQuery("")}
                                        style={styles.clearButton}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={20}
                                            color={Colors[theme].icon}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        <FlatList
                            data={filteredItems}
                            renderItem={renderDropdownItem}
                            keyExtractor={(item) => item.value}
                            style={[styles.dropdownList, { maxHeight }]}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <ThemedText style={styles.emptyText}>
                                        {searchQuery ? "No results found" : "No options available"}
                                    </ThemedText>
                                </View>
                            }
                        />
                    </ThemedView>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 48,
    },
    disabledDropdown: {
        opacity: 0.6,
    },
    dropdownContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownText: {
        flex: 1,
        fontSize: 16,
    },
    placeholderText: {
        opacity: 0.6,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    dropdownModal: {
        borderRadius: 12,
        borderWidth: 1,
        width: '100%',
        maxWidth: 400,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
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
    dropdownList: {
        flexGrow: 0,
    },
    dropdownItemContainer: {
        // No additional styling needed
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 48,
    },
    disabledItem: {
        opacity: 0.5,
    },
    dropdownItemText: {
        flex: 1,
        fontSize: 16,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        opacity: 0.6,
        textAlign: 'center',
    },
});