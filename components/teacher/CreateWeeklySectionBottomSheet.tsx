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
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { StyleSheet, View } from "react-native";

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
    const snapPoints = useMemo(() => ["25%", "50%", "95"], []);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    const handleClose = useCallback(() => {
        if (onClose) onClose();
        dismiss();
    }, [onClose, dismiss]);

    const handleOpen = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleCreate = useCallback(() => {
        onSubmit({ title, description, videoUrl });
        setTitle("");
        setDescription("");
        setVideoUrl("");
        handleClose();
    }, [title, description, videoUrl, onSubmit, handleClose]);

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
                            placeholder="Title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <ThemedBottomSheetTextInput
                            label="Description"
                            placeholder="Description"
                            multiline
                            numberOfLines={3}
                            value={description}
                            onChangeText={setDescription}
                        />
                        <ThemedBottomSheetTextInput
                            label="Video URL"
                            placeholder="Video URL (optional)"
                            value={videoUrl}
                            onChangeText={setVideoUrl}
                        />
                        <Button onPress={handleCreate}>Create</Button>
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
});

export default CreateWeeklySectionBottomSheet;
