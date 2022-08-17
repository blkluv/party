import { useAuthenticator } from "@aws-amplify/ui-react";
import { PartyBoxHost, PartyBoxHostRole } from "@party-box/common";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Input } from "@conorroberts/beluga";
import { LoadingIcon } from "~/components/Icons";
import MetaData from "~/components/MetaData";
import getToken from "~/utils/getToken";
import { Form, useFormik } from "formik";
import FormGroup from "~/components/form/FormGroup";
import { FileUploadField } from "~/components/form";
import FormPreviewImage from "~/components/FormPreviewImage";
import isUserAdmin from "~/utils/isUserAdmin";

// This is the data we get back from our API.
type ProfileHostsDisplay = Pick<PartyBoxHost & PartyBoxHostRole, "name" | "description" | "imageUrl" | "id" | "role">;

const Page = () => {
  const { user } = useAuthenticator();

  const [hosts, setHosts] = useState<ProfileHostsDisplay[]>([]);
  const [loading, setLoading] = useState({ hosts: false });
  const [viewMode, setViewMode] = useState<"view" | "create">("view");

  const { handleChange, handleSubmit, values, setFieldValue } = useFormik({
    initialValues: {
      name: "",
      description: "",
      imageUrl: "",
      imageData: null,
    },
    onSubmit: () => {
      return;
    },
  });

  useEffect(() => {
    (async () => {
      setLoading((prev) => ({ ...prev, hosts: true }));
      try {
        if (!user) return;

        const { data } = await axios.get<ProfileHostsDisplay[]>("/api/user/hosts", {
          headers: { Authorization: `Bearer ${getToken(user)}` },
        });

        setHosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading((prev) => ({ ...prev, hosts: false }));
      }
    })();
  }, [user]);

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
    <div className="mx-auto max-w-3xl w-full m-2">
      <MetaData title="My Hosts" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-2xl">{viewMode === "view" ? "View Hosts" : "Create Host"}</h1>
        {isUserAdmin(user) && (
          <Button variant="outlined" onClick={() => setViewMode(viewMode === "view" ? "create" : "view")}>
            {viewMode === "view" ? "Create Host" : "View Hosts"}
          </Button>
        )}
      </div>

      {viewMode === "view" && (
        <>
          <div className="divide-y divide-gray-800">
            {hosts.map((host) => (
              <Link passHref key={`host card ${host.id}`} href={`/hosts/${host.id}`}>
                <div className="p-2 flex gap-4 hover:bg-gray-800 rounded-md transition cursor-pointer">
                  <div className="relative rounded-full object-cover overflow-hidden w-16 h-16">
                    <Image
                      src={host.imageUrl}
                      className="rounded-full object-cover overflow-hidden w-16 h-16"
                      objectFit="cover"
                      layout="fill"
                      alt="Host profile photo"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-bold text-lg">{host.name}</h2>
                    <p className="text-gray-200 text-sm">{host.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {loading.hosts && <LoadingIcon className="animate-spin mx-auto my-8" size={30} />}
        </>
      )}

      {viewMode === "create" && isUserAdmin(user) && (
        <>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormGroup name="name" label="Name">
              <Input name="name" onChange={handleChange} value={values.name} placeholder="Name" />
            </FormGroup>
            <FormGroup name="description" label="Description">
              <Input name="description" onChange={handleChange} value={values.description} placeholder="Description" />
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
        </>
      )}
    </div>
  );
};

export default Page;
