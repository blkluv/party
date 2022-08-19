import { FC, ReactNode } from "react";

interface Props {
  label: string;
  disabled?: boolean;
  children: ReactNode;
  error?: string;
}

const FormGroup: FC<Props> = ({ label, children, error }) => {
  return (
    <div>
      <div className="form-label-group">
        <label>{label}</label>
        {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
      </div>
      {children}
    </div>
  );
};

export default FormGroup;
