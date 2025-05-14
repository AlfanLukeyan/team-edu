import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import {
  TouchableOpacity
} from "react-native";

interface ButtonProps {
  icon?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

export function Button({ icon, children, onPress }: ButtonProps) {
  const theme = useColorScheme() ?? "light";

  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor: Colors[theme].button, padding: 10, borderRadius: 15, alignItems: 'center'}}>
        <ThemedText style={{color: theme == 'light' ? Colors.dark.text : Colors.light.text}}>{children}</ThemedText>
    </TouchableOpacity>
  );
}