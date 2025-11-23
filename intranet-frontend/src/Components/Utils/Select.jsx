import React from "react";
import Select from "react-select";

export default function CustomSelect({
  options,
  selectedOption,
  setSelectedOption,
  name,
  placeholder,
  isMulti = true,
  required = false,
}) {
  return (
    <div className="form-control">
      <label className="label-text font-medium">
        {name}
        {required && <span className="text-error">*</span>}
      </label>
      <Select
        options={options}
        value={selectedOption || []}
        onChange={setSelectedOption}
        placeholder={placeholder}
        isMulti={isMulti}
        isClearable
        unstyled
        className="w-full"
        classNames={{
          control: () =>
            "input input-bordered flex items-center w-full h-12 min-h-12 max-h-32 overflow-auto",
          placeholder: () => "text-base-content/50",
          input: () => "text-base-content",
          valueContainer: () => "flex flex-wrap gap-1 mr-6 pr-2",
          multiValue: () =>
            "badge badge-primary badge-outline mr-2 mb-1 max-w-[200px] overflow-hidden",
          multiValueLabel: () => "truncate text-primary",
          multiValueRemove: () =>
            "hover:cursor-pointer hover:bg-error/20 hover:text-error rounded transition-colors",
          indicatorsContainer: () => "flex absolute right-0 inset-y-0 pr-2",
          clearIndicator: () =>
            "hover:cursor-pointer hover:bg-error/20 hover:text-error rounded transition-colors",
          dropdownIndicator: () =>
            "hover:cursor-pointer hover:bg-secondary/20 hover:text-accent rounded transition-colors",
          menu: () =>
            "menu bg-base-100 rounded-box border border-base-300 shadow-lg w-full",
          option: ({ isFocused, isSelected }) =>
            `menu-item p-3 cursor-pointer flex items-center transition-colors ${
              isSelected
                ? "bg-primary text-primary-content"
                : isFocused
                ? "bg-primary/10 text-primary"
                : "hover:bg-base-200"
            }`,
        }}
      />
    </div>
  );
}
