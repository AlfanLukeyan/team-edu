import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ModalEmitter } from "@/services/modalEmitter";
import { tokenService } from "@/services/tokenService";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface AttachmentCardProps {
    name: string;
    url: string;
    downloadable?: boolean;
}

export function AttachmentCard({ name, url, downloadable = true }: AttachmentCardProps) {
    const theme = useColorScheme() ?? "light";
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!url) {
            ModalEmitter.showError("No download URL available");
            return;
        }

        if (!downloadable) {
            Linking.openURL(url).catch(() => {
                ModalEmitter.showError("Failed to open attachment");
            });
            return;
        }

        try {
            setDownloading(true);
            ModalEmitter.showLoading("Downloading...");

            const token = await tokenService.getValidToken();
            const fileExtension = url.split('.').pop()?.split('?')[0] || 'pdf';
            const fileName = name.includes('.') ? name : `${name}.${fileExtension}`;
            const downloadUri = FileSystem.documentDirectory + fileName;

            const downloadResult = await FileSystem.downloadAsync(url, downloadUri, {
                headers: { Authorization: `Bearer ${token}` }
            });

            ModalEmitter.hideLoading();

            if (downloadResult.status === 200) {
                ModalEmitter.showSuccess("Downloaded successfully!");

                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(downloadResult.uri, {
                        mimeType: getMimeType(fileExtension),
                        dialogTitle: `Share ${fileName}`,
                    });
                }
            } else {
                throw new Error(`Download failed`);
            }
        } catch (error) {
            ModalEmitter.hideLoading();
            ModalEmitter.showError("Download failed. Opening in browser...");

            setTimeout(() => {
                Linking.openURL(url);
            }, 1000);
        } finally {
            setDownloading(false);
        }
    };

    const getMimeType = (extension: string): string => {
        const types: Record<string, string> = {
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            txt: 'text/plain',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            mp4: 'video/mp4',
            mp3: 'audio/mpeg',
        };
        return types[extension.toLowerCase()] || 'application/octet-stream';
    };

    return (
        <Pressable onPress={handleDownload} style={styles.pressable} disabled={downloading}>
            <View style={[
                styles.container,
                {
                    borderColor: Colors[theme].border,
                    opacity: downloading ? 0.7 : 1
                }
            ]}>
                <Ionicons
                    name={downloading ? "download" : "document-attach"}
                    size={24}
                    color={Colors[theme].text}
                    style={styles.icon}
                />
                <ThemedText
                    type="default"
                    style={styles.filename}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {downloading ? "Downloading..." : name}
                </ThemedText>

                {downloadable && !downloading && (
                    <Ionicons
                        name="download-outline"
                        size={16}
                        color={Colors[theme].tint}
                        style={styles.downloadIcon}
                    />
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        width: '100%',
    },
    container: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        width: '100%',
        minHeight: 48,
    },
    icon: {
        marginRight: 8,
        flexShrink: 0,
        marginTop: 2,
    },
    filename: {
        flex: 1,
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    downloadIcon: {
        marginLeft: 8,
        flexShrink: 0,
        marginTop: 2,
    },
});