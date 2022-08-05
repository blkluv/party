import { ErrorMessage } from "formik";
import CustomErrorMessage from "./CustomErrorMessage";
import { ReactNode } from "react";

interface Props {
  name: string;
  label: string;
  disabled?: boolean;
  children: ReactNode;
}

const FormGroup = ({ label, name, children }: Props) => {
  return (
    <div>
      <div className="form-label-group">
        <p>{label}</p>
        <ErrorMessage name={name} component={CustomErrorMessage} />
      </div>
      {children}
    </div>
  );
};

export default FormGroup;
