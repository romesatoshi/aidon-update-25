
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  multiline?: boolean;
  className?: string;
}

export function FormField({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  multiline = false,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs font-medium mb-1 block">
        {label}{required && '*'}
      </label>
      {multiline ? (
        <Textarea
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="min-h-[80px]"
        />
      ) : (
        <Input
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
}
