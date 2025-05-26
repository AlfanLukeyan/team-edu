import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    type TouchableOpacityProps,
    View,
} from "react-native";

export type ButtonProps = TouchableOpacityProps & {
    children?: React.ReactNode;
    type?: "default" | "secondary" | "delete";
    disabled?: boolean;
    icon?: {
        name: React.ComponentProps<typeof IconSymbol>["name"];
        size?: number;
    };
};

export function Button({
    style,
    type = "default",
    children,
    disabled = false,
    icon,
    ...rest
}: ButtonProps) {
    const theme = useColorScheme() ?? "light";

    const textColor =
        type === "default"
            ? theme === "light"
                ? Colors.dark.text
                : Colors.light.text
            : type === "delete"
                ? Colors[theme].error
                : Colors[theme].button;

    return (
        <TouchableOpacity
            style={[
                styles.base,
                type === "default"
                    ? { backgroundColor: Colors[theme].button }
                    : undefined,
                type === "secondary"
                    ? {
                        backgroundColor: "transparent",
                        borderWidth: 1,
                        borderColor: Colors[theme].button,
                    }
                    : undefined,
                type === "delete"
                    ? {
                        backgroundColor: "transparent",
                        borderWidth: 1,
                        borderColor: Colors[theme].error,
                    }
                    : undefined,
                disabled && { opacity: 0.5 },
                style,
            ]}
            disabled={disabled}
            {...rest}
        >
            <View style={[
                styles.content,
                { justifyContent: icon ? "space-between" : "center", paddingHorizontal: icon ? 8 : 0, width: icon ? "100%" : undefined }
            ]}>
                <ThemedText
                    style={{
                        color: textColor,
                        marginRight: icon ? 8 : 0,
                    }}
                >
                    {children}
                </ThemedText>

                {icon && (
                    <IconSymbol
                        name={icon.name}
                        size={icon.size || 24}
                        color={textColor}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        padding: 8,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
    },
});