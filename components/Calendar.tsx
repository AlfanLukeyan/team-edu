import type { DateType } from 'react-native-ui-datepicker';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';

export type { DateType };

interface CalendarProps {
  selected: DateType;
  onDateChange: (date: DateType) => void;
}

export function Calendar({ selected, onDateChange }: CalendarProps) {
  const defaultStyles = useDefaultStyles();

  return (
    <DateTimePicker
      mode="single"
      date={selected}
      onChange={({ date }) => onDateChange(date)}
      styles={defaultStyles}
      showOutsideDays={true}
      timePicker={true}
    />
  );
}