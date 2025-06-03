import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

interface SearchBarProps {
    visible: boolean;
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
    placeholder?: string;
    loading?: boolean;
    autoFocus?: boolean;
}

export function SearchBar({
    visible,
    value,
    onChangeText,
    onClear,
    placeholder = "Search...",
    loading = false,
    autoFocus = true
}: SearchBarProps) {
    const colorScheme = useColorScheme();

    if (!visible) return null;

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
                    placeholder={placeholder}
                    placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                    value={value}
                    onChangeText={onChangeText}
                    autoFocus={autoFocus}
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color={Colors[colorScheme ?? 'light'].icon}
                        />
                    </TouchableOpacity>
                )}
                {loading && (
                    <ActivityIndicator
                        size="small"
                        color={Colors[colorScheme ?? 'light'].tint}
                        style={styles.searchLoader}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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