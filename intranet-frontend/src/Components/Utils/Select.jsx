import useMediaQuery, { TOUCH_QUERY } from "@/hooks/useMediaQuery";

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
  fixedSize = false,
  className = "",
}) {
  // Le clavier virtuel masquerait la liste, qui reste courte : la saisie ne sert qu'avec un vrai clavier.
  const isTouch = useMediaQuery(TOUCH_QUERY);

  // Taille fixe : les choix sont résumés sur une ligne, et la liste reste ouverte pour en cocher plusieurs.
  const summary = fixedSize ? (selectedOption || []).map((option) => option.label).join(", ") : "";
  const fixedSizeProps = fixedSize
    ? { controlShouldRenderValue: false, hideSelectedOptions: false, closeMenuOnSelect: false, blurInputOnSelect: false }
    : {};

  return (
    <div className={`form-control ${className}`} title={summary || undefined}>
      <label className="label-text font-medium">
        {name}
        {required && <span className="text-error">*</span>}
      </label>
      <Select
        options={options}
        value={selectedOption || []}
        onChange={setSelectedOption}
        placeholder={summary || placeholder}
        isMulti={isMulti}
        isClearable
        isSearchable={!isTouch}
        menuPlacement="auto"
        unstyled
        className="w-full"
        {...fixedSizeProps}
        classNames={{
          control: () =>
            `input input-bordered flex items-center w-full ${
              fixedSize ? "h-12 min-h-12 overflow-hidden" : "h-auto min-h-12 max-h-32 overflow-auto"
            }`,
          placeholder: () => `min-w-0 truncate ${summary ? "text-base-content" : "text-base-content/50"}`,
          input: () => "text-base-content",
          valueContainer: () =>
            fixedSize ? "flex min-w-0 flex-1 flex-nowrap mr-12" : "flex flex-wrap gap-1 mr-6 pr-2",
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
