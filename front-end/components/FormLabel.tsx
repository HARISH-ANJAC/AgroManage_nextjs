"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

interface FormLabelProps extends ComponentPropsWithoutRef<typeof Label> {
  required?: boolean;
}

/**
 * FormLabel wraps the shadcn Label and appends a red asterisk
 * when `required` is true, or when the children end with " *".
 */
export function FormLabel({ children, required, className, ...props }: FormLabelProps) {
  // Parse children to strip trailing " *" and use the required prop instead
  let text = children;
  let isRequired = required;

  if (typeof children === "string" && children.trimEnd().endsWith("*")) {
    text = children.trimEnd().slice(0, -1).trimEnd();
    isRequired = true;
  }

  return (
    <Label className={cn(className)} {...props}>
      {text}
      {isRequired && (
        <span className="required ml-0.5" aria-hidden="true"> *</span>
      )}
    </Label>
  );
}
