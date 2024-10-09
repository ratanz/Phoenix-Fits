import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-blue-600"
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-2 text-white">{label}</span>
    </label>
  );
};