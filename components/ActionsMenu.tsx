import { Colors } from '@/constants/Colors';
import { useColorScheme } from "@/hooks/useColorScheme";
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

interface QuestionActionsMenuProps {
    onEdit: () => void;
    onDelete: () => void;
}

const QuestionActionsMenu: React.FC<QuestionActionsMenuProps> = ({ onEdit, onDelete }) => {
    const theme = useColorScheme() || "light";
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <IconSymbol name="pencil" color={Colors[theme].icon} size={24} />
                <ThemedText style={styles.actionText}>Edit</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <IconSymbol name="trash" color={Colors[theme].icon} size={24} />
                <ThemedText style={styles.actionText}>Delete</ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 4,
    },
});

export default QuestionActionsMenu;