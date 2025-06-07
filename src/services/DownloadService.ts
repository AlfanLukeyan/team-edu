import { ModalEmitter } from "@/services/modalEmitter";
import { tokenService } from "@/services/tokenService";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";

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
            ModalEmitter.showLoading("Downloading...");
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

            ModalEmitter.hideLoading();

            if (downloadResult.status === 200) {
                ModalEmitter.showSuccess("Downloaded successfully!");

                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(downloadResult.uri, {
                        dialogTitle: `Share ${sanitizedFileName}`,
                    });
                }
            } else {
                throw new Error(`Download failed with status ${downloadResult.status}`);
            }
        } catch (error) {
            ModalEmitter.hideLoading();
            ModalEmitter.showError("Download failed. Opening in browser...");
            setTimeout(() => Linking.openURL(url), 1000);
            throw error;
        }
    }

    async openFile(url: string): Promise<void> {
        try {
            await Linking.openURL(url);
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
                const match = contentDisposition.match(/filename=(.+)/);
                if (match) {
                    return match[1].replace(/"/g, '');
                }
            }

            return `download_${Date.now()}.pdf`;
        } catch (error) {
            return `download_${Date.now()}.pdf`;
        }
    }

    private sanitizeFileName(fileName: string): string {
        return fileName
            .replace(/[<>:"/\\|?*]/g, '_')
            .replace(/\s+/g, '_')
            .replace(/_{2,}/g, '_')
            .trim();
    }
}

export const downloadService = DownloadService.getInstance();