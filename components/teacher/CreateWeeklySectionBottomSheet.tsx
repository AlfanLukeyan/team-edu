import { Button } from "@/components/teacher/Button";
import ThemedBottomSheetTextInput from "@/components/ThemedBottomSheetTextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { WeeklySectionFormData } from "@/types/common";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const theme = useColorScheme() || "light";
  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleClose = useCallback(() => bottomSheetRef.current?.close(), []);
  const handleOpen = useCallback(() => bottomSheetRef.current?.snapToIndex(1), []);

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
        pressBehavior="close"
      />
    ),
    []
  );

  useImperativeHandle(ref, () => ({ open: handleOpen, close: handleClose }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: Colors[theme].text,
      }}
      backgroundStyle={{
        backgroundColor: Colors[theme].background,
        borderRadius: 24,
      }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ThemedView style={styles.innerContainer} isCard={false}>
          <View style={styles.header}>
            <ThemedText type="bold">Create</ThemedText>
            <ThemedText type="default"> Weekly Section</ThemedText>
          </View>

          <ThemedBottomSheetTextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Please enter title"
          />

          <ThemedBottomSheetTextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Please enter description"
            multiline
            numberOfLines={4}
          />

          <ThemedBottomSheetTextInput
            label="Video URL"
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder="Please enter video URL"
          />

          <Button onPress={handleCreate}>Create</Button>
        </ThemedView>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: { flex: 1, padding: 0 },
  innerContainer: { flex: 1, paddingHorizontal: 25 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
});

export default CreateWeeklySectionBottomSheet;