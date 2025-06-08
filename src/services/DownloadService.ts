import { ModalEmitter } from "@/services/modalEmitter";
import { tokenService } from "@/services/tokenService";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

class DownloadService {
    private static instance: DownloadService;

    static getInstance(): DownloadService {
        if (!DownloadService.instance) {
            DownloadService.instance = new DownloadService();
        }
        return DownloadService.instance;
    }

    async downloadFile(url: string): Promise<void> {
        if (!url) {
            throw new Error("No download URL available");
        }

        try {
            const token = await tokenService.getValidToken();
            if (!token) {
                throw new Error("No valid token available");
            }

            const fileName = await this.getFilenameFromServer(url, token);
            const sanitizedFileName = this.sanitizeFileName(fileName);
            const downloadUri = FileSystem.documentDirectory + sanitizedFileName;

            const downloadResult = await FileSystem.downloadAsync(url, downloadUri, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (downloadResult.status === 200) {
                const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
                
                if (!fileInfo.exists) {
                    throw new Error("Downloaded file not found");
                }

                await this.shareFile(downloadResult.uri, sanitizedFileName);
            } else {
                throw new Error(`Download failed with status ${downloadResult.status}`);
            }
        } catch (error) {
            const message = Platform.OS === 'ios'
                ? "Download failed. Opening in Safari..."
                : "Download failed. Opening in browser...";

            ModalEmitter.showError(message);
            setTimeout(() => Linking.openURL(url), 1000);
            throw error;
        }
    }

    private async shareFile(fileUri: string, fileName: string): Promise<void> {
        try {
            const isAvailable = await Sharing.isAvailableAsync();

            if (isAvailable) {
                await Sharing.shareAsync(fileUri, {
                    dialogTitle: Platform.OS === 'ios' ? `Save ${fileName}` : `Share ${fileName}`,
                    mimeType: this.getMimeType(fileName),
                    UTI: Platform.OS === 'ios' ? this.getUTI(fileName) : undefined,
                });
            } else {
                throw new Error("Sharing not available");
            }
        } catch (error) {
            const message = Platform.OS === 'ios'
                ? "File downloaded. Check Files app in Downloads folder."
                : "File downloaded to device storage.";
            
            ModalEmitter.showError(message);
        }
    }

    async openFile(url: string): Promise<void> {
        try {
            const canOpen = await Linking.canOpenURL(url);

            if (canOpen) {
                await Linking.openURL(url);
            } else {
                throw new Error("Cannot open this URL");
            }
        } catch (error) {
            throw new Error("Failed to open attachment");
        }
    }

    private async getFilenameFromServer(url: string, token: string): Promise<string> {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                headers: { Authorization: `Bearer ${token}` },
            });

            const contentDisposition = response.headers.get('content-disposition');
            if (contentDisposition) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match) {
                    const filename = match[1].replace(/['"]/g, '');
                    return filename;
                }
            }

            const urlPath = new URL(url).pathname;
            const urlFilename = urlPath.split('/').pop();

            if (urlFilename && urlFilename.includes('.')) {
                return urlFilename;
            }

            return `download_${Date.now()}.pdf`;
        } catch (error) {
            return `download_${Date.now()}.pdf`;
        }
    }

    private sanitizeFileName(fileName: string): string {
        let sanitized = fileName
            .replace(/[<>:"/\\|?*]/g, '_')
            .replace(/\s+/g, '_')
            .replace(/_{2,}/g, '_')
            .replace(/^_+|_+$/g, '')
            .trim();

        if (sanitized.length > 100) {
            const extension = sanitized.split('.').pop();
            const name = sanitized.substring(0, 90);
            sanitized = extension ? `${name}.${extension}` : name;
        }

        if (!sanitized || sanitized === '.') {
            sanitized = `download_${Date.now()}.pdf`;
        }

        return sanitized;
    }

    private getMimeType(filename: string): string {
        const extension = filename.split('.').pop()?.toLowerCase();

        const mimeTypes: { [key: string]: string } = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt': 'text/plain',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'zip': 'application/zip',
        };

        return mimeTypes[extension || ''] || 'application/octet-stream';
    }

    private getUTI(filename: string): string {
        const extension = filename.split('.').pop()?.toLowerCase();

        const utiTypes: { [key: string]: string } = {
            'pdf': 'com.adobe.pdf',
            'doc': 'com.microsoft.word.doc',
            'docx': 'org.openxmlformats.wordprocessingml.document',
            'xls': 'com.microsoft.excel.xls',
            'xlsx': 'org.openxmlformats.spreadsheetml.sheet',
            'txt': 'public.plain-text',
            'jpg': 'public.jpeg',
            'jpeg': 'public.jpeg',
            'png': 'public.png',
            'zip': 'public.zip-archive',
        };

        return utiTypes[extension || ''] || 'public.data';
    }
}

export const downloadService = DownloadService.getInstance();
