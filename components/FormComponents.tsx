import React, { InputHTMLAttributes, useRef, useState } from "react";
import { IoIosArrowUp as ArrowIcon } from "react-icons/io";
import { AiOutlineCheck as CheckIcon, AiOutlineClose as CloseIcon } from "react-icons/ai";
import { BiHelpCircle as TooltipIcon } from "react-icons/bi";
import { HiOutlineInformationCircle as InfoIcon } from "react-icons/hi"
import PopupContainer from "./PopupContainer";
import { ButtonHTMLAttributes } from "react";
import { TextareaHTMLAttributes } from "react";
import { SelectHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
}

export const Button = (props: ButtonProps) => {
  const styles = "focus:ring-0 focus:outline-none appearance-none";
  const styleTypes = {
    default: "rounded-lg bg-white border border-gray-200 transition hover:bg-blue-500 hover:text-white px-4 py-2",
    blank: ""
  }
  return (
    <button
      {...props}
      className={`${props.className} ${styleTypes[props?.variant ?? "default"]} ${styles} ${props.disabled && "filter brightness-50 cursor-default"}`}
      type={props.type}
    >
      {props.children}
    </button>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  showError?: boolean;
  variant?: string;
}
export const Input = (properties: InputProps) => {
  const props = { ...properties };
  const styles = "focus:ring-1 focus:outline-none appearance-none";
  const styleTypes = {
    default: "bg-white text-black rounded-md w-full border placeholder-gray-300 bg-opacity-20 py-2 px-2 border border-gray-300",
    blank: "",
    error: "border-red-500"
  }

  const className = `${props.className} ${styleTypes[props?.variant ?? "default"]} ${props.showError && styleTypes.error} ${styles}`;

  if (props.showError !== null) delete props.showError;

  return (
    <input
      {...props}
      className={className}
    />
  );
};

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  showError: boolean;
  variant: string | undefined;
}
export const TextArea = (properties: TextAreaProps) => {
  const props = { ...properties };
  const styles = "focus:ring-1 focus:outline-none appearance-none";
  const styleTypes = {
    default: "bg-white text-black rounded-md w-full border placeholder-gray-300 bg-opacity-20 py-2 px-2 border border-gray-300 h-72",
    blank: "",
    error: "border-red-500"
  }

  const className = `${props.className} ${styleTypes[props?.variant ?? "default"]} ${props.showError && styleTypes.error} ${styles}`;

  if (props.showError !== null) delete props.showError;

  return (
    <textarea
      {...props}
      className={className}
    />
  );
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {

}

export const Select = (props: SelectProps) => {
  const [open, setOpen] = useState(false);

  const onBlur = (e: any) => {
    if (props.onBlur) props?.onBlur(e);
    if (open) {
      setOpen(!open);
    }
  };
  const onClick = (e: any) => {
    if (props.onClick) props?.onClick(e);
    setOpen(!open);
  };

  return (
    <div className={`relative w-full flex items-center`}>
      <select
        className={`py-2 pl-2 pr-6 w-full rounded-md appearance-none focus:ring-1 focus:outline-none border border-gray-300 bg-white`}
        {...props}
        onBlur={onBlur}
        onClick={onClick}
      >
        {props.children}
      </select>
      <div
        className={`absolute right-1 top-0 flex items-center bottom-0 transform transition-transform duration-75 ${open && "rotate-180"
          }`}
      >
        <ArrowIcon className="w-5 h-5 text-black fill-current" />
      </div>
    </div>
  );
};

interface LabelProps {
  className?: string,
  children: any
}

export const Label = ({ children, className }: LabelProps) => {
  return (
    <p className={`text-lg font-semibold ${className}`}>
      {children}
    </p>
  );
};

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {

}

export const Checkbox = (props: CheckboxProps) => {
  return (
    <div
      className={`relative cursor-pointer w-5 h-5 rounded-sm border border-black ${props.className}`}
    >
      <input
        {...props}
        type="checkbox"
        className={`rounded-md cursor-pointer appearance-none`}
      />
      {/* Checkmark */}
      <div
        className={`absolute cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 filter ${props.value ? "opacity-100" : "opacity-0"
          }`}
      >
        <CheckIcon className="w-5 h-5" />
      </div>
    </div>
  );
};

interface TooltipProps {
  className?: string,
  text: string
}

export const Tooltip = (props: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const ref: any = useRef();
  return (
    <div
      className="relative inline-block p-1"
      onClick={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <InfoIcon className="w-6 h-6 cursor-pointer transition hover:text-blue-500" onClick={() => setVisible(true)} />
      {visible && (
        <PopupContainer setOpen={setVisible} passRef={ref}>
          <div className="flex justify-center sm:m-8 m-2" ref={ref}>
            <div className="bg-white p-4 sm:p-8 rounded-xl w-full max-w-lg">
              <CloseIcon className="w-5 h-5 transition hover:text-blue-500 ml-auto cursor-pointer mb-3" onClick={() => setVisible(false)} />
              <p>
                {props.text}
              </p>
            </div>
          </div>
        </PopupContainer>
      )}
    </div>
  );
};
