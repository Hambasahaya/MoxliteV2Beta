type iOption = {
  label: string;
  value: any;
};

export type iDropdown = {
  selectedValue: iOption;
  options: iOption[];
  defaultValue?: boolean;
  placeholder?: string;
  onChange: (value: iOption) => void;
};
