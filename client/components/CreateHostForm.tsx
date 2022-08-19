import { useAuthenticator } from "@aws-amplify/ui-react";
import { FC, useEffect } from "react";
import { Button, Input } from "@conorroberts/beluga";
import getToken from "~/utils/getToken";
import { useFormik } from "formik";
import FormGroup from "~/components/form/FormGroup";
import { FileUploadField } from "~/components/form";
import FormPreviewImage from "~/components/FormPreviewImage";
import * as Yup from "yup";
import createHost from "~/utils/createHost";

interface Props {
  onSubmit: () => void;
}
const CreateHostForm: FC<Props> = ({ onSubmit }) => {
  const { user } = useAuthenticator();

  const { handleChange, handleSubmit, values, setFieldValue, errors } = useFormik({
    initialValues: {
      name: "",
      description: "",
      imageUrl: "",
      imageData: null,
    },
    onSubmit: async ({ name, description, imageUrl }) => {
      try {
        await createHost({ name, imageUrl, description }, values.imageData, getToken(user));
        onSubmit();
      } catch (error) {
        console.error(error);
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      imageUrl: Yup.string().required("Image URL is required"),
    }),
  });

  // Every time the host image changes, update the preview URL
  useEffect(() => {
    if (!values.imageData || typeof values.imageData === "string") return;
    const url = URL.createObjectURL(values.imageData);
    setFieldValue("imageUrl", url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [values.imageData, setFieldValue]);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FormGroup label="Name" error={errors.name}>
        <Input name="name" onChange={handleChange} value={values.name} placeholder="Name" />
      </FormGroup>
      <FormGroup label="Description" error={errors.description}>
        <Input onChange={handleChange} value={values.description} placeholder="Description" name="description" />
      </FormGroup>
      {!values.imageData && <FileUploadField onChange={(data) => setFieldValue("imageData", data)} />}
      {values.imageUrl.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center">
          <FormPreviewImage
            removeImage={() => {
              setFieldValue("imageData", null);
              setFieldValue("imageUrl", "");
            }}
            name={typeof values.imageData === "string" ? values.imageData : values.imageData.name}
            image={values.imageUrl}
          />
        </div>
      )}
      <div className="flex justify-center">
        <Button type="submit" variant="filled" color="gray">
          Create Host
        </Button>
      </div>
    </form>
  );
};

export default CreateHostForm;
