import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

interface DatePickerComponentProps {
  onDateChange: (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void; // Prop to handle date changes
  dateRange: { startDate: Date | undefined; endDate: Date | undefined; key: string }[]; // New prop to receive date range
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  onDateChange,
  dateRange,
}) => {
  const [open, setOpen] = useState(false); // State to control the visibility
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  // Handle clicking outside the date picker to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false); // Close the date picker if clicked outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateChange = (item: any) => {
    onDateChange({
      startDate: item.selection.startDate,
      endDate: item.selection.endDate,
    }); // Call the prop function with the new dates
  };

  const formatDateRange = () => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) {
      return "Select Date";
    }
    return `${startDate.toDateString()} to ${endDate.toDateString()}`;
  };

  // Ensure that null dates are handled gracefully in the picker
  const getValidDateRange = () => {
    const { startDate, endDate, key } = dateRange[0];
    return [{
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      key: key
    }];
  };

  return (
    <>
      <input
        id="datePicker"
        style={{ width: "450px" }}
        className="ml-2 rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        onClick={() => setOpen(!open)}
        value={formatDateRange()}
        readOnly
      />
      {open && (
        <div className="date-range rounded" ref={datePickerRef}>
          <DateRange
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={getValidDateRange()}
            direction="horizontal"
            rangeColors={["#077fc8"]}
            editableDateInputs={true}
          />
        </div>
      )}
    </>
  );
};

export default DatePickerComponent;
