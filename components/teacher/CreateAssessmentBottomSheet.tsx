import { DateType } from "@/components/Calendar";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/teacher/Button";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
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
import ThemedBottomSheetTextInput from "../ThemedBottomSheetTextInput";
import { ThemedView } from "../ThemedView";

export interface CreateAssessmentBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface CreateAssessmentBottomSheetProps {
  onSubmit: (data: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    duration: string;
  }) => void;
}

const CreateAssessmentBottomSheet = forwardRef<
  CreateAssessmentBottomSheetRef,
  CreateAssessmentBottomSheetProps
>(({ onSubmit}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<DateType>(null);
  const [endDate, setEndDate] = useState<DateType>(null);
  const [duration, setDuration] = useState("");
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
  // const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
  const theme = useColorScheme();

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleCreate = useCallback(() => {
    onSubmit({
      title,
      description,
      start_date: startDate instanceof Date ? startDate.toISOString() : "",
      end_date: endDate instanceof Date ? endDate.toISOString() : "",
      duration
    });
    setTitle("");
    setDescription("");
    setDuration("");
    handleClose();
  }, [title, description, startDate, endDate, duration, onSubmit, handleClose]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        onPress={handleClose}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const formatDate = (date: DateType) => {
    if (!date) return "Select date";
    return new Date(
      date instanceof Date ? date : (date && typeof date === "object" && "toDate" in date ? date.toDate() : date)
    ).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.snapToIndex(0);
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      animateOnMount={false}
      animationConfigs={{
        duration: 300,
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
          style={{ flex: 1, paddingHorizontal: 25 }}
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
            <ThemedText type="default">Assessment</ThemedText>
          </View>

          <ThemedBottomSheetTextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter assessment title"
          />

          <ThemedBottomSheetTextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter assessment description"
            multiline={true}
            numberOfLines={4}
          />
          

          <ThemedBottomSheetTextInput
            label="Duration (minutes)"
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration in minutes"
            keyboardType="numeric"
          />

          <Button onPress={handleCreate}>Create Assessment</Button>
        </ThemedView>
      </BottomSheetView>
    </BottomSheet>
    );
});

const styles = StyleSheet.create({});

export default CreateAssessmentBottomSheet;