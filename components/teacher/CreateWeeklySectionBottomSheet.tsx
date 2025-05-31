import { Button } from "@/components/Button";
import ThemedBottomSheetTextInput from "@/components/ThemedBottomSheetTextInput";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { WeeklySectionFormData } from "@/types/common";
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import * as DocumentPicker from 'expo-document-picker';
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface CreateWeeklySectionBottomSheetRef {
    open: () => void;
    close: () => void;
}

interface CreateWeeklySectionBottomSheetProps {
    onSubmit: (data: WeeklySectionFormData) => void;
    onClose?: () => void;
}

const CreateWeeklySectionBottomSheet = forwardRef<
    CreateWeeklySectionBottomSheetRef,
    CreateWeeklySectionBottomSheetProps
>(({ onSubmit, onClose }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { dismiss } = useBottomSheetModal();
    const theme = useColorScheme() || "light";
    const snapPoints = useMemo(() => ["25%", "60%", "95"], []);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

    const handleClose = useCallback(() => {
        if (onClose) onClose();
        dismiss();
    }, [onClose, dismiss]);

    const handleOpen = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handlePickFile = useCallback(async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: false,
            });

            if (!result.canceled && result.assets?.[0]) {
                setSelectedFile(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking file:', error);
        }
    }, []);

    const handleRemoveFile = useCallback(() => {
        setSelectedFile(null);
    }, []);

    const handleCreate = useCallback(() => {
        const formData: WeeklySectionFormData = {
            title,
            description,
            videoUrl: videoUrl || undefined,
            file: selectedFile ? {
                uri: selectedFile.uri,
                name: selectedFile.name,
                type: selectedFile.mimeType || 'application/octet-stream',
            } as any : undefined,
        };

        onSubmit(formData);
        setTitle("");
        setDescription("");
        setVideoUrl("");
        setSelectedFile(null);
        handleClose();
    }, [title, description, videoUrl, selectedFile, onSubmit, handleClose]);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    useImperativeHandle(ref, () => ({ open: handleOpen, close: handleClose }));

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            handleIndicatorStyle={{
                backgroundColor:
                    theme === "dark" ? Colors.dark.text : Colors.light.text,
                opacity: 0.5,
            }}
            backgroundStyle={{
                backgroundColor:
                    theme === "dark" ? Colors.dark.background : Colors.light.background,
            }}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.innerContainer}>
                    <View style={styles.header}>
                        <ThemedText style={{ fontSize: 16, fontFamily: "Poppins-Bold" }}>
                            Create
                        </ThemedText>
                        <ThemedText style={{ fontSize: 16, fontFamily: "Poppins-Regular" }}>
                            Weekly Section
                        </ThemedText>
                    </View>
                    <View style={{ gap: 8 }}>
                        <ThemedBottomSheetTextInput
                            label="Title"
                            placeholder="Enter section title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <ThemedBottomSheetTextInput
                            label="Description"
                            placeholder="Enter section description"
                            multiline
                            numberOfLines={3}
                            value={description}
                            onChangeText={setDescription}
                        />
                        <ThemedBottomSheetTextInput
                            label="Video URL"
                            placeholder="Enter video URL (optional)"
                            value={videoUrl}
                            onChangeText={setVideoUrl}
                        />
                        
                        {/* File Upload Section */}
                        <View style={styles.fileSection}>
                            <ThemedText style={styles.fileLabel}>Attachment (optional)</ThemedText>
                            {selectedFile ? (
                                <View style={styles.selectedFileContainer}>
                                    <ThemedText style={styles.fileName} numberOfLines={1}>
                                        {selectedFile.name}
                                    </ThemedText>
                                    <TouchableOpacity onPress={handleRemoveFile} style={styles.removeButton}>
                                        <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={handlePickFile} style={styles.filePickerButton}>
                                    <ThemedText style={styles.filePickerText}>Choose File</ThemedText>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Button onPress={handleCreate} disabled={!title || !description}>
                            Create
                        </Button>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    contentContainer: { flex: 1, padding: 0 },
    innerContainer: { paddingHorizontal: 25 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        gap: 4,
    },
    fileSection: {
        marginVertical: 8,
    },
    fileLabel: {
        fontSize: 14,
        marginBottom: 8,
        opacity: 0.7,
    },
    filePickerButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    filePickerText: {
        opacity: 0.7,
    },
    selectedFileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
    },
    fileName: {
        flex: 1,
        marginRight: 8,
    },
    removeButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    removeButtonText: {
        color: '#ff4444',
        fontSize: 12,
    },
});

export default CreateWeeklySectionBottomSheet;