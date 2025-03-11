export type iOption = {
  label: string;
  value: any;
};

export type iDropdown = {
  selectedValue: iOption | null;
  options: iOption[];
  placeholder?: string;
  onChange: (value: iOption) => void;
};
