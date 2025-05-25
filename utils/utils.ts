import * as Brightness from 'expo-brightness';
import { SaveFormat } from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';

export const setMaxBrightness = async (): Promise<void> => {
  try {
    await Brightness.setBrightnessAsync(1.0);
    console.log('Brightness set to maximum');
  } catch (error) {
    console.error('Failed to set brightness:', error);
  }
};

export const restoreBrightness = async (): Promise<void> => {
  try {
    await Brightness.restoreSystemBrightnessAsync();
    console.log('Brightness restored to system default');
  } catch (error) {
    console.error('Failed to restore brightness:', error);
  }
};

export const processAndResizeImage = async (
  imageUri: string,
  context: any,
  width: number = 1300,
  height: number = 1300
): Promise<{ uri: string }> => {
  context.reset();
  context.resize({ width, height });
  
  const image = await context.renderAsync();
  const resizedResult = await image.saveAsync({
    format: SaveFormat.JPEG,
    compress: 1,
  });
  
  console.log("Resized photo:", resizedResult);
  return resizedResult;
};

export const saveImageToGallery = async (imageUri: string): Promise<void> => {
  try {
    await MediaLibrary.saveToLibraryAsync(imageUri);
    console.log("Photo saved to gallery for debugging");
  } catch (error) {
    console.log("Gallery save failed (no permission?):", error);
  }
};

export const simulateSuccessWithDelay = (
  onSuccess: () => void,
  delay: number = 1000
): void => {
  setTimeout(onSuccess, delay);
};