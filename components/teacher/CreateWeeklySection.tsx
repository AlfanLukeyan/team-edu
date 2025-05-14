import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/teacher/Button";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "../TextInput";
import { ThemedView } from "../ThemedView";

export interface CreateWeeklySectionRef {
  open: () => void;
  close: () => void;
}

interface CreateWeeklySectionProps {
  onSubmit: (data: {
    title: string;
    description: string;
    videoUrl: string;
  }) => void;
  onStateChange?: (isOpen: boolean) => void;
}

const CreateWeeklySection = forwardRef<
  CreateWeeklySectionRef,
  CreateWeeklySectionProps
>(({ onSubmit, onStateChange }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const theme = useColorScheme();
  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    onStateChange?.(false);
  }, [onStateChange]);

  const handleCreate = useCallback(() => {
    onSubmit({ title, description, videoUrl });
    setTitle("");
    setDescription("");
    setVideoUrl("");
    handleClose();
  }, [title, description, videoUrl, onSubmit, handleClose]);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
      onStateChange?.(true);
    },
    close: () => {
      bottomSheetRef.current?.close();
      onStateChange?.(false);
    },
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={(index) => {
        onStateChange?.(index >= 0);
      }}
      handleIndicatorStyle={{
        backgroundColor:
          theme === "dark" ? Colors.dark.text : Colors.light.text,
      }}
      backgroundStyle={{
        backgroundColor:
          theme === "dark" ? Colors.dark.background : Colors.light.background,
        borderRadius: 24,
      }}
    >
      <BottomSheetView style={{ flex: 1, padding: 0 }}>
        <ThemedView
          style={{ flex: 1, paddingHorizontal: 25, gap: 14 }}
          isCard={false}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <ThemedText type="bold" style={{ paddingRight: 3 }}>
              Create
            </ThemedText>
            <ThemedText type="default">Weekly Section</ThemedText>
          </View>
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Please enter title"
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Please enter description"
            multiline={true}
            numberOfLines={4}
          />
          <TextInput
            label="Video URL"
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder="Please enter video URL"
          />

          <View style={styles.buttonContainer}>
            <Button onPress={handleClose}>Cancel</Button>
            <Button onPress={handleCreate}>Create</Button>
          </View>
        </ThemedView>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default CreateWeeklySection;
