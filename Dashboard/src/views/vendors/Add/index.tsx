import {
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  Input,
  Select,
  SelectItem,
  Button,
  Textarea,
  Image,
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
import { useAppDispatch, useAppSelector } from "../../../Common/hooks";
import { useUpdatUserMutation } from "../../../Service.mjs";
import { getCookie, setCookie } from "../../../JsFiles/CommonFunction.mjs";
import { infoData } from "../../../configData";
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
  const navigate = useNavigate();
  const [addVendors] = useAddVendorsMutation();
  const [updateVendors] = useUpdateVendorsMutation();
  const [updateUser] = useUpdatUserMutation();
  const id = getCookie("id");
  const vendorId = getCookie("vendorId");
  const currentUserRole = getCookie("role");
  const { itemId } = useParams();
  const { data, error, refetch } = useGetVendorsByIDQuery(
    itemId ? itemId : vendorId ? vendorId : null
  );

  console.log(data, "errors70987");

  React.useEffect(() => {
    refetch();
    if (data?.data.length > 0) {
      reset(data?.data?.[0]);
      setValue("status", data?.data?.[0]?.status.toString());
      setValue("adharCardNo", Number(data?.data?.[0]?.adharCardNo));
      setValue("storename", data?.data?.[0]?.storename);
      setValue("email", data?.data?.[0]?.email);
      setValue("phone", data?.data?.[0]?.phone);
      setValue("phone", data?.data?.[0]?.phone);
      setValue("userId", data?.data?.[0]?.users?.[0]?.id);
    }
  }, [data]);

  const onSubmit = async (data: any) => {
    let tempAPIData = {
      ...data,
      areaId: 3,
      adharCardNo: Number(data?.adharCardNo),
    };

    const formData = new FormData();
    for (const key in tempAPIData) {
      formData.append(key, tempAPIData[key]);
    }
    let tempAPIUserData = {
      id: data?.userId,
      verify: data?.status,
      email: data?.email,
    };
    if (data?.id) {
      const resultVendor = await updateVendors(formData);
      if (resultVendor?.data?.success) {
        let result = await updateUser(tempAPIUserData);
        if (result) {
          refetch();
          navigate("/Dashboard");
        }
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex justify-center"
    >
      <div className="w-5/6">
        <div className="flex items-center justify-between border-b pb-3 mt-2  mb-4">
          <Chip
            size="lg"
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
            <p className="font-medium  text-black/70"> Update Profile</p>
          </Chip>
          <div className="text-center">
            <Button
              color="primary"
              type="submit"
              size="md"
              className="w-[90px]"
            >
              {id ? "Update" : "Create"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <Controller
            name="storename" // Changed to reflect a text input
            control={control}
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              <InputNextUI
                type="text"
                label="Store Name"
                {...field}
                isRequired={true}
                isInvalid={errors?.["storename"] ? true : false}
                errorMessage={errors?.["storename"]?.message}
              />
            )}
          />
          {currentUserRole === "0" && (
            <Controller
              name="status" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <Select
                  isRequired={true}
                  isInvalid={errors?.["status"] ? true : false}
                  errorMessage={errors?.["status"]?.message}
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
                  selectedKeys={String(formData?.status)}
                  errorMessage={errors?.["status"]?.message}
                >
                  <SelectItem key={1}>{"Active"}</SelectItem>
                  <SelectItem key={0}>{"InActive"}</SelectItem>
                </Select>
              )}
            />
          )}
          <Controller
            name="shopaddress" // Changed to reflect a text input
            control={control}
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              <TeaxtareaNextUI
                label="Shop Address"
                {...field}
                isRequired={true}
                isInvalid={errors?.["shopaddress"] ? true : false}
                errorMessage={errors?.["shopaddress"]?.message}
              />
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
            render={({ field }) => (
              <InputNextUI type="text" label="website" {...field} />
            )}
          />
          <Controller
            name="location" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <InputNextUI type="text" label="location" {...field} />
            )}
          />
          <Controller
            name="openTime" // Changed to reflect a text input
            control={control}
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              <InputNextUI
                type="text"
                label="Open Time"
                {...field}
                isRequired={true}
                isInvalid={errors?.["openTime"] ? true : false}
                errorMessage={errors?.["openTime"]?.message}
              />
            )}
          />
          <Controller
            name="closeTime" // Changed to reflect a text input
            control={control}
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              <InputNextUI
                type="text"
                label="Close Time"
                {...field}
                isRequired={true}
                isInvalid={errors?.["closeTime"] ? true : false}
                errorMessage={errors?.["closeTime"]?.message}
              />
            )}
          />
          <div className="flex">
            <Controller
              name="vendorImage" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type="file"
                    id="file"
                    style={{
                      opacity: 0,
                      position: "absolute",
                      zIndex: -1,
                      width: "100%",
                    }}
                    onChange={(e) => {
                      console.log(e, "Selected file");
                      field.onChange(e.target.files[0]); // Update form state with selected file
                      document.getElementById("fileLabel").innerText = e.target
                        .files[0]
                        ? e.target.files[0].name
                        : "No file selected"; // Update label dynamically
                    }}
                  />
                  <label
                    htmlFor="file"
                    style={{
                      border: "1px solid rgba(128, 128, 128, 0.3)",
                      borderRadius: "7px",
                      padding: "10px",
                      width: "100%",
                      display: "inline-block",
                      textAlign: "center",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Choose File
                  </label>
                  <span
                    id="fileLabel"
                    style={{
                      marginLeft: "10px",
                      textAlign: "start",
                      fontSize: "12px",
                    }}
                  >
                    No file selected
                  </span>
                </div>
              )}
            />
            <Image
              src={`${infoData.baseApi}/${data?.data?.[0]?.vendorImage}`}
              className="h-fit"
              width={100}
            />
          </div>
        </div>
        <div className="flex flex-col flex-wrap gap-4 border-b pb-3 mb-4">
          <Chip
            size="lg"
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
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              <InputNextUI
                type="text"
                label="Owner Name"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
                isRequired={true}
                isInvalid={errors?.["ownername"] ? true : false}
                errorMessage={errors?.["ownername"]?.message}
              />
            )}
          />
          <Controller
            name="email" // Changed to reflect a text input
            control={control}
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              <InputNextUI
                type="email"
                label="Email"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
                isRequired={true}
                isInvalid={errors?.["email"] ? true : false}
                errorMessage={errors?.["email"]?.message}
              />
            )}
          />
          <Controller
            name="password" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
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
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              // <Input type="number" label="Phone Number" size="lg" {...field} />
              <InputNextUI
                type="number"
                label="Phone Number"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
                isRequired={true}
                isInvalid={errors?.["phone"] ? true : false}
                errorMessage={errors?.["phone"]?.message}
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
            size="lg"
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
        {/* <div className="text-center">
          <Button color="primary" type="submit">
            {id ? "Update" : "Create"}
          </Button>
        </div> */}
      </div>
    </form>
  );
};

export default Add;
