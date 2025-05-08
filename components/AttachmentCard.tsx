import { IconSymbol } from "@/components/ui/IconSymbol";
import * as Linking from "expo-linking";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface AttachmentCardProps {
  name: string;
  url: string;
}

export function AttachmentCard({ name, url }: AttachmentCardProps) {
  const handlePress = () => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        console.error("An error occurred opening the attachment:", err);
      });
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.container}>
          <IconSymbol
            name={"document.fill"}
            size={24}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <ThemedText type="default">
            {name}
          </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    borderColor: '#AAAAAA',
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
