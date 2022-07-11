/* eslint-disable indent */
import React, { ForwardedRef, forwardRef } from "react";

export interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "blank" | "file";
  error?: boolean;
  field?: object;
}

const TextArea = forwardRef(({ error, field, ...props }: TextAreaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
  delete props.form;
  const { variant = "default" } = props;
  const className = `
  ${props.className} focus:ring-0 focus:outline-none appearance-none
  ${
    variant !== "blank" &&
    `text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 rounded-md w-full border h-10 px-2 
  ${error ? "border-red-500" : "border-gray-300 focus:border-indigo-300 border-gray-300 dark:border-gray-700"}`
  }
  ${props?.disabled && "filter brightness-50"}`;

  return <textarea {...props} {...field} className={className} ref={ref} />;
});

TextArea.displayName = "TextArea";

export default TextArea;
