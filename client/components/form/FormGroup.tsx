import { ErrorMessage, Field } from "formik";
import CustomErrorMessage from "./CustomErrorMessage";
import Input from "./Input";

interface Props {
  placeholder: string;
  name: string;
  label: string;
  type?: string;
  disabled?: boolean;
}

const FormGroup = ({ placeholder, name, label, type = "text" }: Props) => {
  return (
    <div>
      <div className="form-label-group">
        <p>{label}</p>
        <ErrorMessage name={name} component={CustomErrorMessage} />
      </div>
      <Field component={Input} name={name} placeholder={placeholder} type={type} />
    </div>
  );
};

export default FormGroup;
