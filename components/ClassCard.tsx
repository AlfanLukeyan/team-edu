import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";

interface ClassCardProps {
  title: string;
  classCode: string;
  description: string;
  onPress?: () => void;
}

export function ClassCard({ title, classCode, description, onPress }: ClassCardProps) {
  const theme = useColorScheme() ?? "light";

  return (
    <Pressable onPress={onPress}>
    <ThemedView style={{ borderRadius: 15, marginBottom: 16 }} isCard>
      <View
        style={{
          zIndex: 2,
          position: "absolute",
          margin: 18,
          right: 0,
        }}
      >
        <IconSymbol
          name="bookmark.fill"
          size={24} 
          color={theme === "light" ? Colors.light.tabIconSelected : Colors.dark.tabIconSelected}
        />
      </View>
      <LinearGradient
        colors={["#BE1BB6", "#1ECEFF"]}
        style={{
          height: 30,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      ></LinearGradient>
      <View style={{ padding: 16 }}>
        <ThemedText type="bold">{title}</ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <ThemedText type="default">{classCode}</ThemedText>
          <IconSymbol
            name="circle.fill"
            size={6}
            color={theme === "light" ? Colors.light.tabIconSelected : Colors.dark.tabIconSelected}
            style={{ marginHorizontal: 8, alignSelf: 'center' }}
          />
          <ThemedText type="default" style={{flexShrink: 1, flex: 1}} numberOfLines={1}>{description}</ThemedText>
        </View>
      </View>
    </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({});