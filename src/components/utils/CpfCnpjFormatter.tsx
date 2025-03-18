import React, { useState } from "react";
import { z } from "zod";

// Zod schema for CPF/CNPJ validation
export const cpfCnpjSchema = z.union([
  z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Invalid CPF format"),
  z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "Invalid CNPJ format"),
]);

// Function to format CPF/CNPJ
export function FormatterCpfCnpj(input: string): string {
  const cpfCnpj = input.replace(/\D/g, ""); // Remove all non-digits

  if (cpfCnpj.length <= 11) {
    // Format as CPF
    return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else {
    // Format as CNPJ
    return cpfCnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
}

// React component for CPF/CNPJ input field
export function CpfCnpjInputField({
  value,
  onChange,
  id,
  name,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  className?: string;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = FormatterCpfCnpj(input); // Format the input visually

    // Validate the formatted input using Zod
    const isValid = cpfCnpjSchema.safeParse(formatted);
    setError(isValid.success ? null : isValid.error.errors[0]?.message);

    // Call the parent onChange with sanitized value (only numbers)
    const sanitized = input.replace(/\D/g, "");
    e.target.value = sanitized; // Update the raw value in the event
    onChange(e);
  };

  return (
    <div>
      <input
        id={id}
        name={name}
        type="text"
        value={FormatterCpfCnpj(value)} // Display the formatted value
        onChange={handleInputChange}
        maxLength={18} // Maximum length for CPF/CNPJ formats
        className={className}
        placeholder=" "
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
