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
import { Pressable, StyleSheet, View } from "react-native";
import { DateType } from "../Calendar";
import CalendarBottomSheet, { CalendarBottomSheetRef } from "./CalendarBottomSheet";

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
  const startDateRef = useRef<CalendarBottomSheetRef>(null);
  const endDateRef = useRef<CalendarBottomSheetRef>(null);
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

  const handleStartDateChange = (date: DateType) => {
    if (date) {
      const dateObj = date instanceof Date ? date : new Date(date as any);
      setFormData(prev => ({
        ...prev,
        start_date: dateObj.toISOString()
      }));
    }
  };

  const handleEndDateChange = (date: DateType) => {
    if (date) {
      const dateObj = date instanceof Date ? date : new Date(date as any);
      setFormData(prev => ({
        ...prev,
        end_date: dateObj.toISOString()
      }));
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useImperativeHandle(ref, () => ({ open: handleOpen, close: handleClose }));

  return (
    <>
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
              <ThemedText style={{ fontSize: 16, fontFamily: "Poppins-Bold" }}>
                Create
              </ThemedText>
              <ThemedText style={{ fontSize: 16, fontFamily: "Poppins-Regular" }}>Assessment</ThemedText>
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

            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>Start Date</ThemedText>
              <Pressable
                style={{borderColor: theme === "light" ? Colors.light.border : Colors.dark.border, borderWidth: 1, borderRadius: 15, paddingVertical: 10, paddingHorizontal: 16}}
                onPress={() => startDateRef.current?.open()}
              >
                <ThemedText type="placeholder">
                  {formData.start_date ? formatDate(formData.start_date) : 'Select start date'}
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>End Date</ThemedText>
              <Pressable
                style={{borderColor: theme === "light" ? Colors.light.border : Colors.dark.border, borderWidth: 1, borderRadius: 15, paddingVertical: 10, paddingHorizontal: 16}}
                onPress={() => endDateRef.current?.open()}
              >
                <ThemedText type="placeholder">
                  {formData.end_date ? formatDate(formData.end_date) : 'Empty'}
                </ThemedText>
              </Pressable>
            </View>

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
      <CalendarBottomSheet
        ref={startDateRef}
        title="Select Start Date & Time"
        selected={formData.start_date ? new Date(formData.start_date) : new Date()}
        onDateChange={handleStartDateChange}
      />

      <CalendarBottomSheet
        ref={endDateRef}
        title="Select End Date & Time"
        selected={formData.end_date ? new Date(formData.end_date) : new Date()}
        onDateChange={handleEndDateChange}
      />
    </>
  );
});

const styles = StyleSheet.create({
  contentContainer: { flex: 1, padding: 0 },
  innerContainer: {paddingHorizontal: 25 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 4,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});

export default CreateAssessmentBottomSheet;