import { Button } from "@/components/teacher/Button";
import ThemedBottomSheetTextInput from "@/components/ThemedBottomSheetTextInput";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AssessmentFormData } from "@/types/common";
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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { dismiss } = useBottomSheetModal();
  const theme = useColorScheme() || "light";
  const snapPoints = useMemo(() => ["25%", "50%", "95%"], []);

  const [formData, setFormData] = useState<AssessmentFormData>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    duration: "",
  });

  const handleClose = useCallback(() => {
    if (onClose) onClose();
    dismiss();
  }, [onClose, dismiss]);
  
  const handleOpen = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleFieldChange = (field: keyof AssessmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = useCallback(() => {
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      duration: "",
    });
    handleClose();
  }, [formData, onSubmit, handleClose]);

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
        backgroundColor: Colors[theme].text,
        opacity: 0.5,
      }}
      backgroundStyle={{
        backgroundColor: Colors[theme].background,
      }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <ThemedText style={{ fontSize: 20, fontFamily: "Poppins-Bold" }}>
              Create Assessment
            </ThemedText>
          </View>

          <ThemedBottomSheetTextInput
            label="Title"
            placeholder="Enter assessment title"
            value={formData.title}
            onChangeText={(value) => handleFieldChange("title", value)}
          />

          <ThemedBottomSheetTextInput
            label="Description"
            placeholder="Enter assessment description"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(value) => handleFieldChange("description", value)}
          />

          <ThemedBottomSheetTextInput
            label="Start Date"
            placeholder="YYYY-MM-DD"
            value={formData.start_date}
            onChangeText={(value) => handleFieldChange("start_date", value)}
          />

          <ThemedBottomSheetTextInput
            label="End Date"
            placeholder="YYYY-MM-DD"
            value={formData.end_date}
            onChangeText={(value) => handleFieldChange("end_date", value)}
          />

          <ThemedBottomSheetTextInput
            label="Duration (minutes)"
            placeholder="Enter duration in minutes"
            keyboardType="numeric"
            value={formData.duration}
            onChangeText={(value) => handleFieldChange("duration", value)}
          />

          <Button onPress={handleSubmit}>Create Assessment</Button>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
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