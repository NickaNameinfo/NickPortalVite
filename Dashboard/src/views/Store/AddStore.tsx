import {
  Button,
  Chip,
  Image,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useAddStoreMutation,
  useGetStoresByIDQuery,
  useUpdateStoreMutation,
} from "./Service.mjs";
import InputNextUI from "../../Components/Common/Input/input";
import TeaxtareaNextUI from "../../Components/Common/Input/Textarea";
import { getCookie, setCookie } from "../../JsFiles/CommonFunction.mjs";
import { useAppSelector } from "../../Common/hooks";
import { useUpdatUserMutation, useUploadFileMutation } from "../../Service.mjs";
import { infoData } from "../../configData";
import { IconStep } from "../../icons";
const AddStore = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const formData = watch();
  const [addStores] = useAddStoreMutation();
  const id = getCookie("id");
  const storeId = getCookie("storeId");
  const currentUserRole = getCookie("role");
  const { itemId } = useParams();
  const getStoreId  = itemId || storeId
  const { data, error, refetch } = useGetStoresByIDQuery(
    getStoreId, { skip:!getStoreId}
  );
  const [updateStores] = useUpdateStoreMutation();
  const [updateUser] = useUpdatUserMutation();
  const [uploadfile] = useUploadFileMutation();

  console.log(formData, "formData", errors);

  React.useEffect(() => {
    if (data?.data) {
      // Reset the form with the first item of the fetched data
      reset(data.data);
      // Set areaId explicitly if it's not part of the fetched data or needs to be fixed
      setValue("areaId", 3);
    }
  }, [data, reset, setValue]);

  const onSubmit = async (data: any) => {
    console.log(data, "data52452354234");

    let storeImageUrl = data.storeImage; // Initialize with current value (could be File or string URL)
    let verifyDocumentUrl = data.verifyDocument; // Initialize with current value (could be File or string URL)

    // Handle storeImage upload if it's a new file
    if (data.storeImage instanceof File) {
      const storeImageFormData = new FormData();
      storeImageFormData.append("file", data.storeImage);
      const storeImageUploadResult = await uploadfile(storeImageFormData);
      if (storeImageUploadResult?.data?.success) {
        storeImageUrl = storeImageUploadResult.data.fileUrl;
      } else {
        alert("Failed to upload store image.");
        return; // Stop submission if upload fails
      }
    } else if (!storeImageUrl) {
      // If it's not a file and not an existing URL, it means it's missing
      alert("Please upload store image.");
      return;
    }

    // Handle verifyDocument upload if it's a new file
    if (data.verifyDocument instanceof File) {
      const verifyDocumentFormData = new FormData();
      verifyDocumentFormData.append("file", data.verifyDocument);
      const verifyDocumentUploadResult = await uploadfile(verifyDocumentFormData);
      if (verifyDocumentUploadResult?.data?.success) {
        verifyDocumentUrl = verifyDocumentUploadResult.data.fileUrl;
      } else {
        alert("Failed to upload verification document.");
        return; // Stop submission if upload fails
      }
    } else if (!verifyDocumentUrl) {
      // If it's not a file and not an existing URL, it means it's missing
      alert("Please upload verification document.");
      return;
    }

    let apiParams = {
      ...data,
      storeImage: storeImageUrl, // Use the uploaded URL or existing URL
      verifyDocument: verifyDocumentUrl, // Use the uploaded URL or existing URL
      areaId: 3,
    };

    // Proceed with updating the store
    const result = await updateStores(apiParams);
    if (result?.data?.success) {
      let tempAPIUserData = {
        id: apiParams?.users?.id,
        email: data?.["email"],
        password: data?.["password"],
        verify: apiParams?.status,
      };
      // Await the updateUser call to ensure it completes before proceeding
      let userResult = await updateUser(tempAPIUserData);
      if (userResult) {
        refetch();
        navigate("/Dashboard");
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
              base: "bg-gradient-to-br  border-small border-white/60 ",
              content: "drop-shadow shadow-black text-white",
            }}
            startContent={<IconStep />}
            variant="faded"
            color="default"
          >
            <p className="font-medium  text-black/70"> Store Update</p>
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
                  isRequired={true}
                  isInvalid={errors?.["status"] ? true : false}
                  errorMessage={errors?.["status"]?.message}
                >
                  <SelectItem key={"1"}>{"Active"}</SelectItem>
                  <SelectItem key={"0"}>{"InActive"}</SelectItem>
                </Select>
              )}
            />
          )}

          <Controller
            name="storeaddress" // Changed to reflect a text input
            control={control}
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              <TeaxtareaNextUI
                label="Shop Address"
                {...field}
                isRequired={true}
                isInvalid={errors?.["storeaddress"] ? true : false}
                errorMessage={errors?.["storeaddress"]?.message}
              />
            )}
          />
          <Controller
            name="storedesc" // Changed to reflect a text input
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
              <InputNextUI type="text" label="website" {...field} />
            )}
          />
          <Controller
            name="location" // Changed to reflect a text input
            control={control}
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              <InputNextUI
                type="text"
                label="location"
                {...field}
                isRequired={true}
                isInvalid={errors?.["location"] ? true : false} // Corrected field name
                errorMessage={errors?.["location"]?.message} // Corrected field name
              />
            )}
          />
          <Controller
            name="openTime" // Changed to reflect a text input
            control={control}
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              <InputNextUI
                type="text" // Changed from "test" to "text"
                label="Open Time"
                {...field}
                isRequired={true}
                isInvalid={errors?.["openTime"] ? true : false} // Corrected field name
                errorMessage={errors?.["openTime"]?.message} // Corrected field name
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
                isInvalid={errors?.["closeTime"] ? true : false} // Corrected field name
                errorMessage={errors?.["closeTime"]?.message} // Corrected field name
              />
            )}
          />
          <div className="flex">
            <Controller
              name="storeImage" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
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
                    Choose Logo
                  </label>
                  <span
                    id="fileLabel"
                    style={{
                      marginLeft: "10px",
                      textAlign: "start",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    No file selected
                  </span>
                </div>
              )}
            />
            {data?.data?.storeImage && (
              <Image
                src={`${data?.data?.storeImage}`}
                className="h-fit"
                width={100}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col flex-wrap gap-4 border-b pb-3 mb-4">
          <Chip
            size="lg"
            classNames={{
              base: "bg-gradient-to-br  border-small border-white/60 ",
              content: "drop-shadow shadow-black text-white",
            }}
            startContent={<IconStep />}
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
            rules={{
              required: "Please enter value in minimum 5 letter",
              minLength: 5,
            }}
            render={({ field }) => (
              <InputNextUI
                type="password"
                label="Password"
                {...field}
                isRequired={true}
                isInvalid={errors?.["password"] ? true : false}
                errorMessage={errors?.["password"]?.message}
              />
            )}
          />
          <Controller
            name="phone" // Changed to reflect a text input
            control={control}
            rules={{
              required: "Please enter value in minimum 5 letter",
              maxLength: 10,
            }}
            render={({ field }) => (
              <InputNextUI
                type="text"
                label="Phone Number"
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
            rules={{ required: "Please enter value" }}
            render={({ field }) => (
              <TeaxtareaNextUI
                label="Owner Address"
                {...field}
                isRequired={true}
                isInvalid={errors?.["owneraddress"] ? true : false}
                errorMessage={errors?.["owneraddress"]?.message}
              />
            )}
          />
          <div className="flex">
            <Controller
              name="verifyDocument" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type="file"
                    id="verifyDocument"
                    style={{
                      opacity: 0,
                      position: "absolute",
                      zIndex: -1,
                      width: "100%",
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.files[0]); // Update form state with selected file
                      document.getElementById("verifyDocumentLabel").innerText = e.target
                        .files[0]
                        ? e.target.files[0].name
                        : "No file selected"; // Update label dynamically
                    }}
                  />
                  <label
                    htmlFor="verifyDocument"
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
                    Choose Government Document
                  </label>
                  <span
                    id="verifyDocumentLabel"
                    style={{
                      marginLeft: "10px",
                      textAlign: "start",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    No file selected
                  </span>
                  {errors?.["verifyDocument"] ? <p className="text-red-500">Please upload verify document to verify your store</p> : null}
                </div>
              )}
            />
            {data?.data?.verifyDocument && (
              <Image
                src={`${data?.data?.verifyDocument}`}
                className="h-fit"
                width={100}
              />
            )}
          </div>
          
        </div>
        <div className="flex flex-col flex-wrap gap-4 border-b pb-3 mt-4 mb-4">
          <Chip
            size="lg"
            classNames={{
              base: "bg-gradient-to-br  border-small border-white/60 ",
              content: "drop-shadow shadow-black text-white",
            }}
            startContent={<IconStep />}
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
              <InputNextUI type="text" label="Accoutn Number" {...field} />
            )}
          />
          <Controller
            name="accountHolderName" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <InputNextUI type="text" label="Accoutn Holder Name" {...field} />
            )}
          />
          <Controller
            name="IFSC" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <InputNextUI type="text" label="IFSC" {...field} />
            )}
          />
          <Controller
            name="bankName" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <InputNextUI type="text" label="Bank Name" {...field} />
            )}
          />
          <Controller
            name="branch" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <InputNextUI type="text" label="Branch" {...field} />
            )}
          />
          <Controller
            name="adharCardNo" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <InputNextUI type="text" label="Aadhar Number" {...field} />
            )}
          />
          <Controller
            name="panCardNo" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <InputNextUI type="text" label="PAN Number" {...field} />
            )}
          />
          <Controller
            name="GSTNo" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <InputNextUI type="text" label="GST" {...field} />
            )}
          />
        </div>
      </div>
    </form>
  );
};

export default AddStore;
