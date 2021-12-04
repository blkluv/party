import React, { forwardRef } from "react";
import { styles, overrides } from "./InputStyles";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "blank" | "file";
  error?: boolean;
}


const Input = forwardRef((props: InputProps, ref: any) => {
  const { variant = "default" } = props;
  const className = `${props.className} ${overrides} ${styles[variant].style} ${props?.error && styles[variant].error} ${props?.disabled && styles[variant].disabled}`;

  // Style specifically if it's a file input
  if (props.type === "file") {
    return (
      <input
        {...props}
        className={className}
        ref={ref}
      />
    );
  }

  return (
    <input
      {...props}
      className={className}
      ref={ref}
    />
  );
});

export default Input;