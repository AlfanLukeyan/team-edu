import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TextInput as RNTextInput } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface TextInputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
}

export function TextInput({
    label,
    error,
    ...rest
}: TextInputProps) {
    const theme = useColorScheme();
    return (
        <ThemedView>
            {label && (
                <ThemedText
                    style={{
                        marginBottom: 4,
                        color: theme === "light" ? Colors.light.text : Colors.dark.text,
                    }}
                >
                    {label}
                </ThemedText>
            )}
            <RNTextInput
                style={{
                    borderWidth: 1,
                    borderColor: error ? "red" : theme === "light" ? Colors.light.border : Colors.dark.border,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 15,
                    color: theme === "light" ? Colors.light.text : Colors.dark.text,
                    fontFamily: "Poppins-Regular",
                    textAlignVertical: "bottom",
                }}
                placeholderTextColor={theme === "light" ? Colors.light.border : Colors.dark.border}
                cursorColor={theme === "light" ? Colors.light.tint : Colors.dark.tint}
                {...rest}
            />
            {error && <ThemedText style={{ color: "red" }}>{error}</ThemedText>}
        </ThemedView>
    );
}