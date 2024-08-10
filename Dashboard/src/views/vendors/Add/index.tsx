import {
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  Input,
  Select,
  SelectItem,
  Button,
  Textarea,
} from "@nextui-org/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  useAddVendorsMutation,
  useGetVendorsByIDQuery,
  useUpdateVendorsMutation,
} from "../Service.mjs";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import InputNextUI from "../../../Components/Common/Input/input";
import TeaxtareaNextUI from "../../../Components/Common/Ddropdown/Textarea";

const Add = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const formData = watch();
  console.log(formData, "Form data");

  const navigate = useNavigate();
  const [addVendors] = useAddVendorsMutation();
  const [updateVendors] = useUpdateVendorsMutation();
  const { id, type } = useParams();
  const { data, error, refetch } = useGetVendorsByIDQuery(id ? id : null);

  React.useEffect(() => {
    if (data?.data.length > 0) {
      reset(data?.data?.[0]);
      setValue("status", data?.data?.[0]?.status.toString());
      setValue("adharCardNo", Number(data?.data?.[0]?.adharCardNo));
    } else {
    }
  }, [data]);

  React.useEffect(() => {
    if (type === "Add") {
      reset();
    }
  }, [type]);

  const onSubmit = async (data: any) => {
    let tempAPIData = {
      ...data,
      areaId: 1,
      adharCardNo: Number(data?.adharCardNo),
    };
    const formData = new FormData();
    for (const key in tempAPIData) {
      formData.append(key, tempAPIData[key]);
    }
    console.log("datafrom data form", formData);
    if (id) {
      const result = await updateVendors(formData);
      if (result?.data?.success) {
        navigate("/Vendors/List");
      }
    } else {
      const result = await addVendors(formData);
      if (result?.data?.success) {
        navigate("/Vendors/List");
      }
      console.log(data, "datadatadatadatadata", result);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex justify-center"
    >
      <div className="w-5/6">
        <div className="flex  items-center justify-between border-b pb-3 mt-4  mb-4">
          <Chip
            classNames={{
              // "border-1",
              base: "bg-gradient-to-br  border-small border-white/60 ",
              content: "drop-shadow shadow-black text-white",
            }}
            startContent={
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                  fill="green"
                />
              </svg>
            }
            variant="faded"
            color="default"
          >
            <p className="font-medium  text-black/70"> Vendor Register</p>
          </Chip>
          <div className="text-center">
            <Button color="primary" type="submit" size="sm" className="w-[90px]">
              {id ? "Update" : "Create"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <Controller
            name="storename" // Changed to reflect a text input
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // <Input type="text" label="Store Name" size="lg" {...field} />
              <InputNextUI type="text" label="Store Name" {...field} />
            )}
          />
          <Controller
            name="status" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Select
                classNames={{
                  label: "group-data-[filled=true]:-translate-y-3",
                  trigger: [
                    "bg-transparent",
                    "border-1",
                    "text-default-500",
                    "transition-opacity",
                    "data-[hover=true]:bg-transparent",
                    "data-[hover=true]:bg-transparent",
                    "dark:data-[hover=true]:bg-transparent",
                    "data-[selectable=true]:focus:bg-transparent",
                  ],
                  // listboxWrapper: [
                  //   "border-1",
                  //   "text-default-500",
                  //   "transition-opacity",
                  //   "data-[hover=true]:text-foreground",
                  //   "data-[hover=true]:bg-default-100",
                  //   "dark:data-[hover=true]:bg-default-50",
                  //   "data-[selectable=true]:focus:bg-default-50",
                  //   "data-[pressed=true]:opacity-90",
                  //   "data-[focus-visible=true]:ring-default-500",
                  // ],
                }}
                listboxProps={{
                  itemClasses: {
                    base: [
                      "rounded-md",
                      "text-default-500",
                      "transition-opacity",
                      "data-[hover=true]:text-foreground",
                      "data-[hover=true]:bg-default-100",
                      "dark:data-[hover=true]:bg-default-50",
                      "data-[selectable=true]:focus:bg-default-50",
                      "data-[pressed=true]:opacity-90",
                      "data-[focus-visible=true]:ring-default-500",
                      "shadow-none",
                      // "border-1",
                    ],
                  },
                }}
                variant="faded"
                size="sm"
                label="Select an Status"
                {...field}
                selectedKeys={formData?.status}
              >
                <SelectItem key={1}>{"Active"}</SelectItem>
                <SelectItem key={0}>{"InActive"}</SelectItem>
              </Select>
            )}
          />
          <Controller
            name="shopaddress" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <TeaxtareaNextUI label="Shop Address" {...field} />
            )}
          />
          <Controller
            name="shopdesc" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <TeaxtareaNextUI label="Discription" {...field} />
            )}
          />
          <Controller
            name="website" // Changed to reflect a text input
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // <Input type="text" label="Store Name" size="lg" {...field} />
              <InputNextUI type="text" label="website" {...field} />
            )}
          />
          <Controller
            name="location" // Changed to reflect a text input
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // <Input type="text" label="Store Name" size="lg" {...field} />
              <InputNextUI type="text" label="location" {...field} />
            )}
          />
          <Controller
            name="openTime" // Changed to reflect a text input
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // <Input type="text" label="Store Name" size="lg" {...field} />
              <InputNextUI type="text" label="Open Time" {...field} />
            )}
          />
          <Controller
            name="closeTime" // Changed to reflect a text input
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // <Input type="text" label="Store Name" size="lg" {...field} />
              <InputNextUI type="text" label="Close Time" {...field} />
            )}
          />
          <Controller
            name="vendorImage" // Changed to reflect a text input
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                type="file"
                // labelPlacement=""
                label="Image"
                size="lg"
                onChange={(e) => {
                  field.onChange(e.target.files[0]); // Don't forget to call field.onChange to update the form state
                }}
              />
            )}
          />
        </div>
        <div className="flex flex-col flex-wrap gap-4 border-b pb-3 mb-4">
          <Chip
            classNames={{
              // "border-1",
              base: "bg-gradient-to-br  border-small border-white/60 ",
              content: "drop-shadow shadow-black text-white",
            }}
            startContent={
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                  fill="green"
                />
              </svg>
            }
            variant="faded"
            color="default"
          >
            <p className="font-medium text-black/70"> Owner Details</p>
          </Chip>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <Controller
            name="ownername" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="Owner Name" size="lg" {...field} />
              <InputNextUI
                type="text"
                label="Owner Name"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="email" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="email" label="Email" size="lg" {...field} />
              <InputNextUI
                type="email"
                label="Email"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="password" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="password" label="Password" size="lg" {...field} />
              <InputNextUI
                type="password"
                label="Password"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="phone" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="number" label="Phone Number" size="lg" {...field} />
              <InputNextUI
                type="number"
                label="Phone Number"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />

          <Controller
            name="owneraddress" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <TeaxtareaNextUI label="Owner Address" {...field} />
            )}
          />
        </div>
        <div className="flex flex-col flex-wrap gap-4 border-b pb-3 mt-4 mb-4">
          <Chip
            classNames={{
              // "border-1",
              base: "bg-gradient-to-br  border-small border-white/60 ",
              content: "drop-shadow shadow-black text-white",
            }}
            startContent={
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                  fill="green"
                />
              </svg>
            }
            variant="faded"
            color="default"
          >
            <p className="font-medium text-black/70"> Bank Details(Optional)</p>
          </Chip>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <Controller
            name="accountNo" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input
              //   type="number"
              //   label="Accoutn Number"
              //   size="lg"
              //   {...field}
              // />
              <InputNextUI
                type="number"
                label="Accoutn Number"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="accountHolderName" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input
              //   type="text"
              //   label="Accoutn Holder Name"
              //   size="lg"
              //   {...field}
              // />
              <InputNextUI
                type="text"
                label="Accoutn Holder Name"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="IFSC" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="IFSC" size="lg" {...field} />
              <InputNextUI
                type="text"
                label="IFSC"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="bankName" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="Bank Name" size="lg" {...field} />
              <InputNextUI
                type="text"
                label="Bank Name"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="branch" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="Branch" size="lg" {...field} />
              <InputNextUI
                type="text"
                label="Branch"
                onChange={(value) => {
                  console.log(value, "Branch");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="adharCardNo" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="Aadhar Number" size="lg" {...field} />
              <InputNextUI
                type="text"
                label="Aadhar Number"
                onChange={(value) => {
                  console.log(value, "Aadhar_Number");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="panCardNo" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="PAN Number" size="lg" {...field} />
              <InputNextUI
                type="text"
                label="PAN Number"
                onChange={(value) => {
                  console.log(value, "PAN_Number");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="GSTNo" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="GST No" size="lg" {...field} />
              <InputNextUI
                type="text"
                label="GST"
                onChange={(value) => {
                  console.log(value, "GST");
                }}
                {...field}
              />
            )}
          />
        </div>
        <div className="text-center">
          <Button color="primary" type="submit">
            {id ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Add;
