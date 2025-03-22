
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  className?: string;
  options?: { value: string; label: string }[];
}

export function FormField({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = "", 
  type = "text",
  required = false,
  multiline = false,
  className = "",
  options = []
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label 
        htmlFor={id} 
        className="text-sm font-medium flex items-center"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {multiline ? (
        <Textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full resize-none"
          rows={3}
          required={required}
        />
      ) : type === "select" && options.length > 0 ? (
        <Select
          name={id}
          value={value}
          onValueChange={(newValue) => {
            // Create a synthetic event to match the onChange interface
            const syntheticEvent = {
              target: {
                name: id,
                value: newValue
              }
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange(syntheticEvent);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full"
        />
      )}
    </div>
  );
}
