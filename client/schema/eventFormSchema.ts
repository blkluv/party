import * as Yup from "yup";

const eventFormSchema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  startTime: Yup.object({
    hour: Yup.number().required("Required").max(12, "<= 12").min(1, ">= 1"),
    minute: Yup.number().required("Required").max(59, "<60").min(0, ">= 0"),
    day: Yup.number().required("Required"),
    month: Yup.number().required("Required"),
    year: Yup.number().required("Required"),
    modifier: Yup.string().oneOf(["AM", "PM"]).required("Required"),
  }),
});

export default eventFormSchema;
