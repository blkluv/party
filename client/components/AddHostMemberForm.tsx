import { Button, Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Input } from "@conorroberts/beluga";
import { useFormik } from "formik";
import { FC } from "react";
import FormGroup from "./form/FormGroup";
import * as Yup from "yup";
import addHostMember from "~/utils/addHostMember";
import AddHostMemberFormData from "~/types/AddHostMemberFormData";
import { useQueryClient } from "react-query";

interface Props {
  hostId: number;
}

const AddHostMemberForm: FC<Props> = ({ hostId }) => {
  const queryClient = useQueryClient();
  
  const { handleSubmit, values, errors, handleChange, setFieldValue, touched, resetForm } = useFormik({
    initialValues: {
      email: "",
      role: "member",
    },
    onSubmit: async (values) => {
      console.log(values);
      try{
        await addHostMember(values as AddHostMemberFormData, hostId);
        resetForm();
        queryClient.refetchQueries("hostRoles");
      }catch(error){
        return;
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email must be a valid email").required("Email is required"),
      role: Yup.string().required("Role is required").oneOf(["member", "admin", "manager"], "Invalid role"),
    }),
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormGroup label="Email" error={touched.email && errors.email}>
        <Input onChange={handleChange} value={values.email} name="email" />
      </FormGroup>
      <div>
        <p className="mb-2">Role</p>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="filled" color="gray">
              <p className="capitalize">{values.role}</p>
            </Button>
          </DropdownTrigger>
          <DropdownContent>
            {["member", "manager", "admin"].map((role) => (
              <DropdownItem key={`manage roles ${role}`} onClick={() => setFieldValue("role", role)}>
                <p className="capitalize">{role}</p>
              </DropdownItem>
            ))}
          </DropdownContent>
        </Dropdown>
      </div>
      <div className="flex justify-center">
        <Button type="submit" variant="filled" color="gray">
          Add Member
        </Button>
      </div>
    </form>
  );
};

export default AddHostMemberForm;
