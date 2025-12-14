interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  readonly?: boolean;
  maxLength?: number;
  width?: string;
}

export function Input({ label, name, value, onChange, required, readonly, maxLength, width }: InputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition
          ${readonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${width ? width : ''}`}
        required={required ?? false}
        readOnly={readonly}
        maxLength={maxLength}
      />
    </div>
  );
}