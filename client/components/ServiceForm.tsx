import { Input, TextArea } from "@conorroberts/beluga";
import { useFormik } from "formik";
import { useEffect } from "react";
import { FileUploadField } from "./form";
import FormGroup from "./form/FormGroup";
import FormPreviewImage from "./FormPreviewImage";

const ServiceForm = () => {
  const { handleSubmit, values, touched, errors, handleChange, setFieldValue } = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      imageData: null,
      imagePreview: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  // Every time the thumbnail changes, update the preview URL
  useEffect(() => {
    if (!values.imageData || typeof values.imageData === "string") return;
    const url = URL.createObjectURL(values.imageData);
    setFieldValue("imagePreview", url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [values.imageData, setFieldValue]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormGroup label="Name" error={touched.name && errors.name}>
        <Input onChange={handleChange} value={values.name} />
      </FormGroup>
      <FormGroup label="Description" error={touched.description && errors.description}>
        <TextArea onChange={handleChange} value={values.description} />
      </FormGroup>
      <FormGroup label="Price" error={touched.price && errors.price}>
        <Input onChange={handleChange} value={values.price} />
      </FormGroup>
      <FormGroup label="Image">
        <FileUploadField onChange={(file) => setFieldValue("imageData", file)} />
      </FormGroup>
      <div className="w-96 h-96">
        {values.imageData && (
          <FormPreviewImage
            image={values.imagePreview}
            removeImage={() => {
              setFieldValue("imageData", null);
              setFieldValue("imagePreview", "");
            }}
            name={values.imageData.name}
          />
        )}
      </div>
    </form>
  );
};

export default ServiceForm;
