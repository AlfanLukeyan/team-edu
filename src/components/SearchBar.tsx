import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

interface SearchBarProps {
    visible: boolean;
    value: string;
    onChangeText: (text: string) => void;
    onEndEditing?: (text: string) => void; // Add this prop
    onClear: () => void;
    placeholder?: string;
    loading?: boolean;
    autoFocus?: boolean;
}

export function SearchBar({
    visible,
    value,
    onChangeText,
    onEndEditing,
    onClear,
    placeholder = "Search...",
    loading = false,
    autoFocus = true
}: SearchBarProps) {
    const colorScheme = useColorScheme();
    const inputRef = useRef<TextInput>(null);

    if (!visible) return null;

    const handleClear = () => {
        onClear();
        // Trigger search with empty string when clearing
        onEndEditing?.('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleEndEditing = () => {
        onEndEditing?.(value);
    };

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
                    ref={inputRef}
                    style={[
                        styles.searchInput,
                        { color: Colors[colorScheme ?? 'light'].text }
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                    value={value}
                    onChangeText={onChangeText} // Only update the text, no API calls
                    onEndEditing={handleEndEditing} // Trigger search when done editing
                    autoFocus={autoFocus}
                    returnKeyType="search"
                    blurOnSubmit={false}
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
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