import React, { useState, useEffect } from "react";
import Select, { GroupBase } from "react-select";
import { StylesConfig } from "react-select";

// Define the option types
interface OptionType {
  label: string;
  value: string;
}

// Define the group type
interface GroupType {
  label: string;
  options: OptionType[];
}

// Props for the Select component
interface PaginatedSelectProps {
  options: (OptionType | GroupType)[];
  onChange: (selectedOption: OptionType | null) => void;
  placeholder?: string;
  className?: string;
  isClearable?: boolean;
  customStyles?: StylesConfig<OptionType, false, GroupBase<OptionType>>;
  value?: OptionType | null;
  defaultValue?: OptionType;
  isDisabled?: boolean;
}

const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
  options,
  onChange,
  placeholder = "Select an option",
  className,
  customStyles,
  value,
  defaultValue,
  isClearable = true,
  isDisabled = false,
}) => {
  const [filteredOptions, setFilteredOptions] =
    useState<(OptionType | GroupType)[]>(options);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Filter options based on input value
    setFilteredOptions(
      options
        .map((option) => {
          if ("options" in option) {
            // If it's a group, filter its options
            return {
              ...option,
              options: option.options.filter((opt) =>
                opt.label.toLowerCase().includes(inputValue.toLowerCase()),
              ),
            };
          }
          // If it's a single option, filter directly
          return option.label.toLowerCase().includes(inputValue.toLowerCase())
            ? option
            : null;
        })
        .filter(Boolean) as (OptionType | GroupType)[],
    );
  }, [inputValue, options]);

  // Define custom styles with a custom height for the dropdown
  const defaultStyles: StylesConfig<
    OptionType,
    false,
    GroupBase<OptionType>
  > = {
    menu: (provided) => ({
      ...provided,
    }),
    // You can add more style customizations here
  };

  return (
    <Select
      options={filteredOptions}
      onInputChange={(value) => setInputValue(value)}
      onChange={(newValue) => onChange(newValue as OptionType | null)}
      placeholder={placeholder}
      styles={{ ...defaultStyles, ...customStyles }}
      className={className}
      isClearable={isClearable}
      value={value}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      classNamePrefix={className}
    />
  );
};

export default PaginatedSelect;
