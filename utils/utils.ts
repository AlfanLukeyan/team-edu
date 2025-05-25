import * as Brightness from 'expo-brightness';
import * as MediaLibrary from 'expo-media-library';

export const setMaxBrightness = async (): Promise<void> => {
  try {
    await Brightness.setBrightnessAsync(1.0);
  } catch (error) {
    console.error('Failed to set brightness:', error);
  }
};

export const restoreBrightness = async (): Promise<void> => {
  try {
    await Brightness.restoreSystemBrightnessAsync();
  } catch (error) {
    console.error('Failed to restore brightness:', error);
  }
};

export const simulateSuccessWithDelay = (
  onSuccess: () => void,
  delay: number = 500
): void => {
  setTimeout(onSuccess, delay);
};

export const saveImageToGallery = async (imageUri: string): Promise<void> => {
  try {
    await MediaLibrary.saveToLibraryAsync(imageUri);
    console.log("Photo saved to gallery for debugging");
  } catch (error) {
    console.log("Gallery save failed (no permission?):", error);
  }
};