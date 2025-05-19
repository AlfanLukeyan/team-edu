import { Button } from "@/components/teacher/Button";
import ThemedBottomSheetTextInput from "@/components/ThemedBottomSheetTextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AssessmentFormData } from "@/types/common";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView
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

export interface CreateAssessmentBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface CreateAssessmentBottomSheetProps {
  onSubmit: (data: AssessmentFormData) => void;
  onClose?: () => void;
}

const CreateAssessmentBottomSheet = forwardRef<
  CreateAssessmentBottomSheetRef,
  CreateAssessmentBottomSheetProps
>(({ onSubmit, onClose }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const theme = useColorScheme() || "light";

  const [formData, setFormData] = useState<AssessmentFormData>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    duration: "",
  });

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleClose = useCallback(() => bottomSheetRef.current?.close(), []);
  const handleOpen = useCallback(() => bottomSheetRef.current?.snapToIndex(1), []);

  const handleFieldChange = (field: keyof AssessmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      duration: "",
    });
    handleClose();
  };

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

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1 && onClose) onClose();
  }, [onClose]);

  useImperativeHandle(ref, () => ({ open: handleOpen, close: handleClose }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: Colors[theme].background,
        borderRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: Colors[theme].text,
        width: 40,
      }}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ThemedView style={styles.innerContainer} isCard={false}>
          <View style={styles.header}>
            <ThemedText type="bold">Create Assessment</ThemedText>
          </View>

          <ThemedBottomSheetTextInput
            label="Title"
            value={formData.title}
            onChangeText={(value) => handleFieldChange("title", value)}
            placeholder="Enter assessment title"
          />

          <ThemedBottomSheetTextInput
            label="Description"
            value={formData.description}
            onChangeText={(value) => handleFieldChange("description", value)}
            placeholder="Enter assessment description"
            multiline
            numberOfLines={4}
          />

          <ThemedBottomSheetTextInput
            label="Duration (minutes)"
            value={formData.duration}
            onChangeText={(value) => handleFieldChange("duration", value)}
            placeholder="Enter duration in minutes"
            keyboardType="numeric"
          />

          <Button onPress={handleSubmit}>
            Create Assessment
          </Button>
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

export default CreateAssessmentBottomSheet;