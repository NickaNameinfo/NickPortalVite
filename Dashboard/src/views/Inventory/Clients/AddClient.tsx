import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import {
  Button,
  Chip,
  Image,
  Card,
  CardBody,
} from "@nextui-org/react";
import React from "react";
import { useGetAllUserQuery, useGetUserQuery, useUploadFileMutation } from "../../../Service.mjs";
import { useGetClientByIdQuery, useCreateClientMutation, useUpdateClientMutation } from "../Service.mjs";
import InputNextUI from "../../../Components/Common/Input/input";
import TeaxtareaNextUI from "../../../Components/Common/Input/Textarea";
import { getCookie } from "../../../JsFiles/CommonFunction.mjs";
import { infoData } from "../../../configData";

const AddClient = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      gstNumber: "",
      logo: "",
      branches: [{ name: "", address: "", phone: "", city: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const userId = getCookie("id");
  const { data, error, refetch } = useGetAllUserQuery();
  const { data: clientData } = useGetUserQuery(Number(id), { skip: !id });
  // Try to use new client API if available, fallback to old API
  const { data: newClientData } = useGetClientByIdQuery(Number(id), { skip: !id });
  const { data: currentUserData } = useGetUserQuery(Number(userId), { skip: !userId });
  const [uploadFile] = useUploadFileMutation();
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [refresh, setRefresh] = React.useState(false);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [selectedLogoFileName, setSelectedLogoFileName] = React.useState("No file selected");
  const formData = watch();

  React.useEffect(() => {
    // Use new client API data if available, otherwise fallback to old API
    const client = newClientData?.data || clientData?.data;
    if (client && id) {
      let branches = [{ name: "", address: "", phone: "", city: "" }];
      if (client.branches) {
        try {
          branches = typeof client.branches === 'string' 
            ? JSON.parse(client.branches) 
            : client.branches;
          if (!Array.isArray(branches) || branches.length === 0) {
            branches = [{ name: "", address: "", phone: "", city: "" }];
          }
        } catch (e) {
          branches = [{ name: "", address: "", phone: "", city: "" }];
        }
      }
      reset({
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
        city: client.city || "",
        gstNumber: client.gstNumber || "",
        logo: client.logo || "",
        branches: branches,
      });
      if (client.logo) {
        setLogoPreview(`${infoData.baseApi}/${client.logo}`);
      }
    }
  }, [clientData, newClientData, id, reset]);

  const onSubmit = async (data: any) => {
    try {
      let logoUrl = data.logo; // Initialize with current value (could be File or string URL)

      // Handle logo upload if it's a new file
      if (data.logo instanceof File) {
        const logoFormData = new FormData();
        logoFormData.append("file", data.logo);
        // Backend expects storeName to create directory structure
        // Get store name from current user data or use fallback
        const storeName = currentUserData?.data?.storename || 
                         currentUserData?.data?.storeName || 
                         vendorId || 
                         storeId || 
                         "STORE";
        logoFormData.append("storeName", storeName);
        const logoUploadResult = await uploadFile(logoFormData);
        if (logoUploadResult?.data?.success) {
          logoUrl = logoUploadResult.data.fileUrl;
        } else {
          alert("Failed to upload logo.");
          return;
        }
      }

      let apiParams = {
        ...data,
        logo: logoUrl,
        branches: JSON.stringify(data.branches || []),
      };
      // Note: vendorId is automatically extracted from authenticated user's session on backend

      // Remove the File object from params if logo is a file
      if (data.logo instanceof File) {
        delete apiParams.logo;
        apiParams.logo = logoUrl;
      }

      // Determine if this is a create or update operation
      if (id) {
        // Update existing client
        try {
          const result = await updateClient({ id: Number(id), ...apiParams }).unwrap();
          if (result?.success) {
            setRefresh(true);
            refetch();
            reset();
            alert("Client updated successfully");
            navigate("/Inventory/Clients/List");
          } else {
            alert(result?.message || "Failed to update client");
          }
        } catch (error: any) {
          alert(error?.data?.message || error?.message || "Failed to update client");
        }
      } else {
        // Create new client
        try {
          const result = await createClient(apiParams).unwrap();
          if (result?.success) {
            setRefresh(true);
            refetch();
            reset();
            alert("Client added successfully");
            navigate("/Inventory/Clients/List");
          } else {
            alert(result?.message || "Failed to add client");
          }
        } catch (error: any) {
          alert(error?.data?.message || error?.message || "Failed to add client");
        }
      }
    } catch (error: any) {
      alert("Error adding client: " + error.message);
    }
  };

  React.useEffect(() => {
    if (refresh) {
      refetch();
      reset();
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <div className="mx-1">
      <form onSubmit={handleSubmit(onSubmit)} className="px-2">
        <div className="flex items-center justify-between border-b pb-3 mt-1.5 mb-3">
          <div>
            <Chip
              size="lg"
              className="py-4 px-2"
              classNames={{
                base: "bg-gradient-to-br border-small border-white/60",
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
              <p className="font-medium text-black/70">Add Client</p>
            </Chip>
          </div>
          <div className="text-center w-[100px]">
            <Button 
              color="primary" 
              size="md" 
              type="submit" 
              className="w-full"
              isLoading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
            >
              {id ? (isUpdating ? "Updating..." : "Update") : (isCreating ? "Creating..." : "Submit")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={control}
              rules={{ 
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters"
                },
                maxLength: {
                  value: 50,
                  message: "First name must not exceed 50 characters"
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "First name can only contain letters and spaces"
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="First Name"
                  size="sm"
                  isRequired
                  isInvalid={!!errors.firstName}
                  errorMessage={errors.firstName?.message as string}
                  placeholder="Enter first name"
                  {...field}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              rules={{
                maxLength: {
                  value: 50,
                  message: "Last name must not exceed 50 characters"
                },
                pattern: {
                  value: /^[A-Za-z\s]*$/,
                  message: "Last name can only contain letters and spaces"
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Last Name (Optional)"
                  size="sm"
                  isInvalid={!!errors.lastName}
                  errorMessage={errors.lastName?.message as string}
                  placeholder="Enter last name (optional)"
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="email"
                  label="Email"
                  size="sm"
                  isRequired
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              rules={{ 
                validate: (value) => {
                  const phoneValue = value ? String(value).trim() : '';
                  if (!phoneValue || phoneValue === '') {
                    return "Phone number is required";
                  }
                  if (phoneValue.length !== 10) {
                    return "Phone number must be exactly 10 digits";
                  }
                  const phoneRegex = /^[6-9]\d{9}$/;
                  if (!phoneRegex.test(phoneValue)) {
                    return "Invalid phone number. Must be 10 digits starting with 6-9";
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="tel"
                  label="Phone Number"
                  size="sm"
                  isRequired
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone?.message as string}
                  placeholder="Enter 10-digit phone number"
                  value={field.value || ''}
                  onChange={(value) => {
                    // InputNextUI passes the value directly, not an event object
                    const cleanedValue = String(value || '').replace(/\D/g, '').slice(0, 10);
                    field.onChange(cleanedValue);
                  }}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              rules={{
                maxLength: {
                  value: 200,
                  message: "Address must not exceed 200 characters"
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Address (Optional)"
                  size="sm"
                  isInvalid={!!errors.address}
                  errorMessage={errors.address?.message as string}
                  placeholder="Enter address (optional)"
                  {...field}
                />
              )}
            />

            <Controller
              name="city"
              control={control}
              rules={{
                maxLength: {
                  value: 50,
                  message: "City name must not exceed 50 characters"
                },
                pattern: {
                  value: /^[A-Za-z\s]*$/,
                  message: "City name can only contain letters and spaces"
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="City (Optional)"
                  size="sm"
                  isInvalid={!!errors.city}
                  errorMessage={errors.city?.message as string}
                  placeholder="Enter city name (optional)"
                  {...field}
                />
              )}
            />

            <Controller
              name="gstNumber"
              control={control}
              rules={{
                pattern: {
                  value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                  message: "Invalid GST number format (e.g., 22AAAAA0000A1Z5)"
                },
                maxLength: {
                  value: 15,
                  message: "GST number must be 15 characters"
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="GST Number (Optional)"
                  size="sm"
                  placeholder="22AAAAA0000A1Z5"
                  isInvalid={!!errors.gstNumber}
                  errorMessage={errors.gstNumber?.message as string}
                  {...field}
                  onChange={(value) => {
                    // InputNextUI passes the value directly, not an event object
                    const cleanedValue = String(value || '').toUpperCase().slice(0, 15);
                    field.onChange(cleanedValue);
                  }}
                />
              )}
            />

            <Controller
              name="logo"
              control={control}
              rules={{
                validate: (value) => {
                  if (value instanceof File) {
                    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                    if (!validTypes.includes(value.type)) {
                      return "File must be an image (JPEG, PNG, GIF, WEBP)";
                    }
                    if (value.size > 2 * 1024 * 1024) {
                      return "File size must not exceed 2MB";
                    }
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Client Logo (Optional)
                  </label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      type="file"
                      id="logoFile"
                      accept="image/*"
                      style={{
                        opacity: 0,
                        position: "absolute",
                        zIndex: -1,
                        width: "100%",
                      }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                          if (!validTypes.includes(file.type)) {
                            alert("Invalid file type. Please select an image (JPEG, PNG, GIF, WEBP).");
                            e.target.value = '';
                            setSelectedLogoFileName("No file selected");
                            setLogoPreview(null);
                            field.onChange(null);
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            alert("File size exceeds 2MB. Please select a smaller file.");
                            e.target.value = '';
                            setSelectedLogoFileName("No file selected");
                            setLogoPreview(null);
                            field.onChange(null);
                            return;
                          }
                          field.onChange(file);
                          setSelectedLogoFileName(file.name);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setLogoPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setSelectedLogoFileName("No file selected");
                          setLogoPreview(null);
                          field.onChange(null);
                        }
                      }}
                    />
                    <label
                      htmlFor="logoFile"
                      className={`block p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                        errors.logo 
                          ? 'border-danger bg-danger-50' 
                          : 'border-default-300 bg-default-50 hover:bg-default-100'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm text-foreground-600">
                          {selectedLogoFileName}
                        </span>
                        <span className="text-xs text-foreground-400">
                          Click to upload (Max 2MB, Image only)
                        </span>
                      </div>
                    </label>
                  </div>
                  {(logoPreview || (formData.logo && typeof formData.logo === 'string')) && (
                    <div className="mt-2">
                      <Image
                        src={logoPreview || `${infoData.baseApi}/${formData.logo}`}
                        alt="Client Logo Preview"
                        width={150}
                        height={150}
                        className="rounded-lg border border-default-200"
                      />
                    </div>
                  )}
                  {errors.logo && (
                    <p className="text-danger text-tiny mt-1">{errors.logo.message as string}</p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Branches Section */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Branches</h3>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onClick={() => append({ name: "", address: "", phone: "", city: "" })}
              >
                Add Branch
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="mb-3">
                <CardBody>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Branch {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name={`branches.${index}.name`}
                      control={control}
                      rules={{ 
                        required: "Branch name is required",
                        minLength: {
                          value: 2,
                          message: "Branch name must be at least 2 characters"
                        },
                        maxLength: {
                          value: 100,
                          message: "Branch name must not exceed 100 characters"
                        }
                      }}
                      render={({ field }) => (
                        <InputNextUI
                          type="text"
                          label="Branch Name"
                          size="sm"
                          isRequired
                          isInvalid={!!errors.branches?.[index]?.name}
                          errorMessage={errors.branches?.[index]?.name?.message as string}
                          placeholder="Enter branch name"
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name={`branches.${index}.phone`}
                      control={control}
                      rules={{
                        pattern: {
                          value: /^[6-9]\d{9}$|^$/,
                          message: "Invalid phone number. Must be 10 digits starting with 6-9"
                        },
                        maxLength: {
                          value: 10,
                          message: "Phone number must be 10 digits"
                        }
                      }}
                      render={({ field }) => (
                        <InputNextUI
                          type="tel"
                          label="Branch Phone (Optional)"
                          size="sm"
                          isInvalid={!!errors.branches?.[index]?.phone}
                          errorMessage={errors.branches?.[index]?.phone?.message as string}
                          placeholder="Enter branch phone (optional)"
                          {...field}
                          onChange={(value) => {
                            // InputNextUI passes the value directly, not an event object
                            const cleanedValue = String(value || '').replace(/\D/g, '').slice(0, 10);
                            field.onChange(cleanedValue);
                          }}
                        />
                      )}
                    />

                    <Controller
                      name={`branches.${index}.address`}
                      control={control}
                      render={({ field }) => (
                        <TeaxtareaNextUI
                          label="Branch Address"
                          size="sm"
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name={`branches.${index}.city`}
                      control={control}
                      rules={{
                        maxLength: {
                          value: 50,
                          message: "City name must not exceed 50 characters"
                        },
                        pattern: {
                          value: /^[A-Za-z\s]*$/,
                          message: "City name can only contain letters and spaces"
                        }
                      }}
                      render={({ field }) => (
                        <InputNextUI
                          type="text"
                          label="Branch City (Optional)"
                          size="sm"
                          isInvalid={!!errors.branches?.[index]?.city}
                          errorMessage={errors.branches?.[index]?.city?.message as string}
                          placeholder="Enter branch city (optional)"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddClient;

