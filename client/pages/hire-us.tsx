import { Button, Input, Select, SelectOption } from "@conorroberts/beluga";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useQuery } from "react-query";
import FormGroup from "~/components/form/FormGroup";
import MetaData from "~/components/MetaData";
import getEventServices from "~/utils/getEventServices";

const Page = () => {
  const { handleSubmit, values, handleChange, touched, errors, status, setStatus, setFieldValue } = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      theme: "",
      startTime: {
        minute: dayjs().minute().toString(),
        hour: (dayjs().hour() % 12).toString(),
        day: dayjs().date().toString(),
        month: dayjs().month().toString(),
        year: dayjs().year().toString(),
        modifier: dayjs().hour() >= 12 ? "PM" : "AM",
      },
      capacity: "50",
      location: "",
      message: "",
      services: [],
      artists: [],
    },
    initialStatus: "event",
    onSubmit: (values) => {
      if (status === "event") {
        setStatus("services");
      } else if (status === "services") {
        setStatus("contact");
      } else if (status === "contact") {
        setStatus("review");
      } else if (status === "review") {
        // Submit here
        console.log(values);
      }
    },
  });

  const { data: services, isLoading: servicesLoading } = useQuery("services", getEventServices);

  return (
    <div>
      <h1 className="font-bold text-3xl text-center">Page</h1>

      <MetaData title="Hire Us" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl mx-auto">
        {status === "event" && (
          <>
            <h2 className="font-bold text-lg">Describe Your Event</h2>
            <FormGroup error={touched.theme && errors.theme} label="Theme">
              <Input onChange={handleChange} name="theme" value={values.theme} />
            </FormGroup>
            <FormGroup error={touched.capacity && errors.capacity} label="Number of Attendees">
              <Input onChange={handleChange} name="capacity" value={values.capacity} />
            </FormGroup>
            <FormGroup error={touched.location && errors.location} label="Location">
              <Input onChange={handleChange} name="location" value={values.location} placeholder="Address, etc." />
            </FormGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-3 gap-1">
                <FormGroup label="Day">
                  <Select
                    name="startTime.day"
                    onValueChange={(value) => setFieldValue("startTime.day", value)}
                    value={values.startTime.day}
                  >
                    <SelectOption value="" disabled>
                      Day
                    </SelectOption>
                    {[
                      ...Array(
                        dayjs().year(Number(values.startTime.year)).month(Number(values.startTime.month)).daysInMonth()
                      ),
                    ].map((_, day) => (
                      <SelectOption key={day} value={(day + 1).toString()} textValue={(day + 1).toString()} />
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup label="Month">
                  <Select
                    name="startTime.month"
                    onValueChange={(value) => setFieldValue("startTime.month", value)}
                    value={values.startTime.month}
                  >
                    {dayjs
                      .localeData()
                      .monthsShort()
                      .map((month, i) => (
                        <SelectOption key={month} value={i.toString()} textValue={month} />
                      ))}
                  </Select>
                </FormGroup>
                <FormGroup label="Year">
                  <Select
                    name="startTime.year"
                    onValueChange={(value) => setFieldValue("startTime.year", value)}
                    value={values.startTime.year}
                  >
                    {[...Array(5)].map((_, year) => (
                      <SelectOption
                        key={year}
                        value={(dayjs().year() + year).toString()}
                        textValue={(dayjs().year() + year).toString()}
                      />
                    ))}
                  </Select>
                </FormGroup>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <FormGroup label="Hour">
                  <Input
                    name="startTime.hour"
                    placeholder="Hour"
                    type="number"
                    onChange={handleChange}
                    value={values.startTime.hour}
                    min={1}
                    max={12}
                  />
                </FormGroup>
                <FormGroup label="Minute">
                  <Input name="startTime.minute" onChange={handleChange} value={values.startTime.minute} />
                </FormGroup>
                <FormGroup label="AM/PM">
                  <Select
                    name="startTime.modifier"
                    onValueChange={(value) => setFieldValue("startTime.modifier", value)}
                    value={values.startTime.modifier}
                  >
                    <SelectOption value="AM" textValue="AM" />
                    <SelectOption value="PM" textValue="PM" />
                  </Select>
                </FormGroup>
              </div>
            </div>
          </>
        )}
        {status === "contact" && (
          <>
            <h2 className="font-bold text-lg">Contact Information</h2>
            <FormGroup error={touched.name && errors.name} label="Name">
              <Input onChange={handleChange} name="name" value={values.name} />
            </FormGroup>
            <FormGroup error={touched.phoneNumber && errors.phoneNumber} label="Phone Number">
              <Input onChange={handleChange} name="phoneNumber" value={values.phoneNumber} />
            </FormGroup>
          </>
        )}
        {status === "Services" && (
          <>
            <h2 className="font-bold text-lg">Contact Information</h2>
            <FormGroup error={touched.name && errors.name} label="Name">
              <Input onChange={handleChange} name="name" value={values.name} />
            </FormGroup>
            <FormGroup error={touched.phoneNumber && errors.phoneNumber} label="Phone Number">
              <Input onChange={handleChange} name="phoneNumber" value={values.phoneNumber} />
            </FormGroup>
          </>
        )}
        {status === "review" && (
          <>
            <h2 className="font-bold text-lg">Review</h2>
          </>
        )}

        <div className="flex justify-center">
          <Button type="submit" variant="filled" color="gray">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
