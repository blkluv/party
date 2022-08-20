import { useAuthenticator } from "@aws-amplify/ui-react";
import { ErrorMessage, FieldArray, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { PartyBoxEvent, PartyBoxHost } from "@party-box/common";
import getToken from "~/utils/getToken";
import { CustomErrorMessage, FileUploadField, TextArea } from "./form";
import FormGroup from "./form/FormGroup";
import FormPreviewImage from "./FormPreviewImage";
import { CloseIcon, LoadingIcon } from "./Icons";
import defaultEventData from "~/utils/defaultEventData";
import formatEventFormValues from "~/utils/formatEventFormValues";
import dayjs from "dayjs";
import eventFormSchema from "~/schema/eventFormSchema";
import {
  Switch,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  Select,
  SelectOption,
} from "@conorroberts/beluga";
import createEvent from "~/utils/createEvent";
import axios from "axios";
import Image from "next/image";

interface Props {
  initialValues?: PartyBoxEvent;
}

const EventForm: FC<Props> = ({ initialValues }) => {
  const { user } = useAuthenticator();
  const router = useRouter();
  const mode = initialValues ? "edit" : "create";

  const [media, setMedia] = useState<(File | string)[]>(initialValues?.media ?? []);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialValues?.media ?? []);
  const [thumbnail, setThumbnail] = useState<File | string>(initialValues?.thumbnail ?? null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialValues?.thumbnail ?? "");
  const [availableHosts, setAvailableHosts] = useState<PartyBoxHost[]>([]);

  // Add a new file to the array of media files
  const addMediaImage = (file: File) => {
    if (!file) return;
    setMedia((prev) => [...prev, file]);
  };

  const removeImage = (index: number) => {
    const url = previewUrls[index];
    setMedia((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(url);
  };

  // Move the media left/right in the array
  const moveMedia = (index: number, direction: "left" | "right") => {
    if ((index === 0 && direction === "left") || (index === media.length - 1 && direction === "right")) return;
    const directionValue = direction === "left" ? -1 : 1;

    const newMedia = [...media];
    const tmpFile = newMedia[index];
    newMedia[index] = newMedia[index + directionValue];
    newMedia[index + directionValue] = tmpFile;
    setMedia(newMedia);

    const newPreviewUrls = [...previewUrls];
    const tmpUrl = newPreviewUrls[index];
    newPreviewUrls[index] = newPreviewUrls[index + directionValue];
    newPreviewUrls[index + directionValue] = tmpUrl;
    setPreviewUrls(newPreviewUrls);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<PartyBoxHost[]>("/api/user/hosts", {
          headers: { Authorization: `Bearer ${getToken(user)}` },
        });
        setAvailableHosts(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user]);

  // Every time media changes, generate preview URLs for all media in the array
  useEffect(() => {
    const newPreviews = media.map((e) => (typeof e === "string" ? e : URL.createObjectURL(e)));
    setPreviewUrls(newPreviews);

    return () => {
      newPreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [media]);

  // Every time the thumbnail changes, update the preview URL
  useEffect(() => {
    if (!thumbnail || typeof thumbnail === "string") return;
    const url = URL.createObjectURL(thumbnail);
    setThumbnailPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [thumbnail]);

  return (
    <Formik
      validationSchema={eventFormSchema}
      onSubmit={async (values, { setStatus }) => {
        try {
          const event = await createEvent({
            values,
            token: getToken(user),
            setUploadState: setStatus,
            thumbnail,
            media,
            originalEventId: initialValues?.id,
            mode,
          });

          await router.push(`/events/${event.id}`);
        } catch (error) {
          console.error(error);
        }
        console.log("Submitted");
      }}
      initialValues={initialValues ? formatEventFormValues(initialValues) : defaultEventData}
    >
      {({ isSubmitting, values, handleChange, setFieldValue, status, errors }) => (
        <Form className="flex flex-col gap-2">
          <div className="flex gap-4 items-center">
            <p>Publish event</p>
            <Switch
              checked={values.published}
              onCheckedChange={(value) => setFieldValue("published", value)}
              name="published"
            />
          </div>
          <FormGroup label="Event Name" error={errors.name}>
            <Input onChange={handleChange} name="name" placeholder="Event name" value={values.name} />
          </FormGroup>
          <div>
            <p>Host</p>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="filled" color="gray">
                  {availableHosts.find(({ id }) => id.toString() === values.hostId) ? (
                    <div className="flex gap-2 items-center py-1">
                      <Image
                        src={availableHosts.find(({ id }) => id.toString() === values.hostId).imageUrl}
                        width={30}
                        height={30}
                        objectFit="cover"
                        alt={`${availableHosts.find(({ id }) => id.toString() === values.hostId).name} profile image`}
                        className="rounded-md"
                      />
                      <p>{availableHosts.find(({ id }) => id.toString() === values.hostId).name}</p>
                    </div>
                  ) : (
                    "Select a host"
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                {availableHosts.map((host) => (
                  <DropdownItem key={`host ${host.name}`} onClick={() => setFieldValue("hostId", host.id.toString())}>
                    <div className="flex gap-2 items-center py-1">
                      <Image
                        src={host.imageUrl}
                        width={30}
                        height={30}
                        objectFit="cover"
                        alt={`${host.name} profile image`}
                        className="rounded-md"
                      />
                      <p>{host.name}</p>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </div>
          <div>
            <div className="form-label-group">
              <p>Description</p>
              <ErrorMessage name={"description"} component={CustomErrorMessage} />
            </div>
            <TextArea
              name="description"
              placeholder="Description"
              rows={5}
              onChange={handleChange}
              value={values.description}
            />
          </div>
          <p>Event Date</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-3 gap-1">
              <FormGroup label="Day">
                <Select
                  name="startTime.day"
                  onValueChange={(value) => setFieldValue("startTime.day", value)}
                  value={values.startTime.day}
                >
                  <SelectOption value="" disabled>Day</SelectOption>
                  {[
                    ...Array(
                      dayjs().year(Number(values.startTime.year)).month(Number(values.startTime.month)).daysInMonth()
                    ),
                  ].map((_, day) => (
                    <SelectOption key={day} value={day.toString()}>
                      {day + 1}
                    </SelectOption>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup label="Month">
                <Select name="startTime.month" onValueChange={(value) => setFieldValue("startTime.month", value)} value={values.startTime.month}>
                  {dayjs
                    .localeData()
                    .monthsShort()
                    .map((month, i) => (
                      <option key={month} value={i.toString()}>
                        {month}
                      </option>
                    ))}
                </Select>
              </FormGroup>
              <FormGroup label="Year">
                <Select name="startTime.year" onValueChange={(value) => setFieldValue("startTime.year", value)} value={values.startTime.year}>
                  {[...Array(5)].map((_, year) => (
                    <option key={year} value={(dayjs().year() + year).toString()}>
                      {dayjs().year() + year}
                    </option>
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
              <FormGroup label="Modifier">
                <Select name="startTime.modifier" onValueChange={(value) => setFieldValue("startTime.modifier", value)} value={values.startTime.modifier}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Select>
              </FormGroup>
            </div>
          </div>
          <FormGroup label="Location" error={errors.location}>
            <Input
              onChange={handleChange}
              name="location"
              value={values.location}
              placeholder="Event location (address, etc.)"
            />
          </FormGroup>
          <FormGroup label="Maximum Tickets Sold" error={errors.maxTickets}>
            <Input
              onChange={handleChange}
              name="maxTickets"
              value={values.maxTickets}
              placeholder="Max tickets"
              type="number"
            />
          </FormGroup>
          <p>Media</p>
          <FileUploadField onChange={addMediaImage} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center my-2">
            {previewUrls.map((image, previewIndex) => (
              <FormPreviewImage
                key={`preview ${previewIndex}`}
                removeImage={() => removeImage(previewIndex)}
                name={
                  typeof media[previewIndex] === "string"
                    ? (media[previewIndex] as string)
                    : (media[previewIndex] as File)?.name
                }
                image={image}
                position={previewIndex + 1}
                onMoveLeft={() => moveMedia(previewIndex, "left")}
                onMoveRight={() => moveMedia(previewIndex, "right")}
              />
            ))}
          </div>
          <p>Thumbnail</p>
          {!thumbnail && <FileUploadField onChange={setThumbnail} />}
          {thumbnailPreview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center">
              <FormPreviewImage
                removeImage={() => {
                  setThumbnail(null);
                  setThumbnailPreview("");
                }}
                name={typeof thumbnail === "string" ? thumbnail : thumbnail.name}
                image={thumbnailPreview}
              />
            </div>
          )}
          <p>Ticket Prices</p>

          <FieldArray name="prices">
            {({ push, remove }) => (
              <>
                {values.prices.map((e, i) => (
                  <div key={`price ${i}`} className="flex flex-col gap-2 bg-gray-800 p-3 rounded-md shadow-md relative">
                    <div
                      className="bg-gray-900 rounded-full p-0.5 flex justify-center items-center absolute top-0 right-0 z-10 transform -translate-y-1/2 translate-x-1/2 border border-gray-700 shadow-md hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => remove(i)}
                    >
                      <CloseIcon />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormGroup label="Name">
                        <Input
                          onChange={handleChange}
                          name={`prices.${i}.name`}
                          value={values.prices[i].name}
                          placeholder="Name"
                        />
                      </FormGroup>
                      <FormGroup label="Price">
                        <Input
                          onChange={handleChange}
                          name={`prices.${i}.price`}
                          value={values.prices[i].price}
                          placeholder="Price"
                          type="number"
                        />
                      </FormGroup>
                    </div>
                  </div>
                ))}
                <div className="flex">
                  <Button variant="outlined" onClick={() => push({ name: "", price: "0" })}>
                    New Price
                  </Button>
                </div>
              </>
            )}
          </FieldArray>
          <p>Notifications</p>
          <FieldArray name="notifications">
            {({ push, remove }) => (
              <>
                {values.notifications.map((e, i) => (
                  <div
                    key={`notification ${i}`}
                    className="flex flex-col gap-2 bg-gray-800 p-3 rounded-md shadow-md relative"
                  >
                    <div
                      className="bg-gray-900 rounded-full p-0.5 flex justify-center items-center absolute top-0 right-0 z-10 transform -translate-y-1/2 translate-x-1/2 border border-gray-700 shadow-md hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => remove(i)}
                    >
                      <CloseIcon />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <FormGroup label="Days">
                        <Input
                          onChange={handleChange}
                          name={`notifications.${i}.days`}
                          value={values.notifications[i].days}
                          type="number"
                        />
                      </FormGroup>
                      <FormGroup label="Hours">
                        <Input
                          onChange={handleChange}
                          name={`notifications.${i}.hours`}
                          value={values.notifications[i].hours}
                          type="number"
                        />
                      </FormGroup>
                      <FormGroup label="Minutes">
                        <Input
                          onChange={handleChange}
                          name={`notifications.${i}.minutes`}
                          value={values.notifications[i].minutes}
                          type="number"
                        />
                      </FormGroup>
                    </div>
                    <TextArea
                      name={`notifications.${i}.message`}
                      placeholder="Message"
                      className="h-24"
                      onChange={handleChange}
                      value={values.notifications[i].message}
                    />
                  </div>
                ))}
                <div className="flex">
                  <Button variant="outlined" onClick={() => push({ message: "", days: "", hours: "", minutes: "" })}>
                    New Notification
                  </Button>
                </div>
              </>
            )}
          </FieldArray>

          <div className="flex items-center gap-4 justify-center">
            {!isSubmitting && (
              <Button type="submit" variant="filled" color="gray">
                Submit
              </Button>
            )}
            {isSubmitting && (
              <>
                <LoadingIcon className="animate-spin" size={25} />
                <p>{status}</p>
              </>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EventForm;
