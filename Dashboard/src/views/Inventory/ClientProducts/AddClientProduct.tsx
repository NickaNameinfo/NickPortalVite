import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Chip,
  Select,
  SelectItem,
  Image,
} from "@nextui-org/react";
import React from "react";
import {
  useCreateInventoryProductMutation,
  useGetInventoryProductByIdQuery,
  useUpdateInventoryProductMutation,
} from "../Service.mjs";
import { useUploadFileMutation, useGetUserQuery } from "../../../Service.mjs";
import { useGetCategoriesQuery } from "../../Categories/Service.mjs";
import { getCookie } from "../../../JsFiles/CommonFunction.mjs";
import InputNextUI from "../../../Components/Common/Input/input";
import { infoData } from "../../../configData";

const AddClientProduct = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      sellingPrice: "",
      currentStock: "",
      sku: "",
      brand: "",
      unit: "pcs",
      costPrice: "",
      reorderLevel: "",
      status: "active",
      photo: null,
    },
  });
  const formData = watch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const userId = getCookie("id");
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = React.useState("No file selected");

  const [createProduct, { isLoading: isCreating }] = useCreateInventoryProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateInventoryProductMutation();
  const [uploadFile] = useUploadFileMutation();
  const { data: currentUserData } = useGetUserQuery(Number(userId), { skip: !userId });

  // Use new inventory products API, fallback to old API if needed
  const { data: productData } = useGetInventoryProductByIdQuery(Number(productId), {
    skip: !productId,
  });

  const {
    data: categoryData,
    error: categoryerror,
    refetch: categoryrefetch,
  } = useGetCategoriesQuery();

  React.useEffect(() => {
    if (productData?.data && productId) {
      const product = productData.data;
      reset({
        name: product.name || "",
        description: product.description || "",
        sellingPrice: product.sellingPrice || "",
        currentStock: product.currentStock || "",
        categoryId: product.categoryId || "",
        sku: product.sku || "",
        brand: product.brand || "",
        unit: product.unit || "pcs",
        reorderLevel: product.reorderLevel || "",
        costPrice: product.costPrice || "",
        status: product.status || "active",
      });
      // Handle photo/image if available
      if (product.photo || product.image) {
        const imageUrl = product.photo || product.image;
        setPhotoPreview(`${infoData.baseApi}/${imageUrl}`);
      }
    }
  }, [productData, productId, reset]);

  const onSubmit = async (data: any) => {
    try {
      let photoUrl = data.photo;

      // Handle photo upload if it's a new file
      if (data.photo instanceof File) {
        const photoFormData = new FormData();
        photoFormData.append("file", data.photo);
        photoFormData.append("productName", data.name || "product");
        // Backend expects storeName to create directory structure
        const storeName = currentUserData?.data?.storename || 
                         currentUserData?.data?.storeName || 
                         vendorId || 
                         storeId || 
                         "STORE";
        photoFormData.append("storeName", storeName);
        const photoUploadResult = await uploadFile(photoFormData);
        if (photoUploadResult?.data?.success) {
          photoUrl = photoUploadResult.data.fileUrl;
        } else {
          alert("Failed to upload product photo.");
          return;
        }
      }

      // Map form data to new API payload structure
      let apiParams: any = {
        name: data.name,
        description: data.description || data.sortDesc || "",
        categoryId: Number(data.categoryId),
        sellingPrice: Number(data.sellingPrice || data.total || 0),
        currentStock: Number(data.currentStock || data.unitSize || 0),
        status: data.status || "active",
      };

      // Optional fields
      if (data.sku) apiParams.sku = data.sku;
      if (data.brand) apiParams.brand = data.brand;
      if (data.unit) apiParams.unit = data.unit;
      if (data.reorderLevel) apiParams.reorderLevel = Number(data.reorderLevel);
      if (data.costPrice) apiParams.costPrice = Number(data.costPrice);
      if (photoUrl) apiParams.photo = photoUrl;

      // Generate SKU if not provided
      if (!apiParams.sku && !productId) {
        apiParams.sku = `SKU-${Date.now()}`;
      }

      if (productId) {
        // Update existing product
        try {
          const result = await updateProduct({ id: Number(productId), ...apiParams }).unwrap();
          if (result?.success) {
            alert("Product updated successfully");
            navigate("/Inventory/ClientProducts/List");
          } else {
            alert(result?.message || "Failed to update product");
          }
        } catch (error: any) {
          alert(error?.data?.message || error?.message || "Failed to update product");
        }
      } else {
        // Create new product
        try {
          const result = await createProduct(apiParams).unwrap();
          if (result?.success) {
            alert("Product added successfully");
            reset();
            setPhotoPreview(null);
            setSelectedFileName("No file selected");
            navigate("/Inventory/ClientProducts/List");
          } else {
            alert(result?.message || "Failed to add product");
          }
        } catch (error: any) {
          alert(error?.data?.message || error?.message || "Failed to add product");
        }
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

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
              <p className="font-medium text-black/70">
                {productId ? "Edit Client Product" : "Add Client Product"}
              </p>
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
              {productId ? (isUpdating ? "Updating..." : "Update") : (isCreating ? "Creating..." : "Submit")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="name"
              control={control}
              rules={{ 
                required: "Product name is required",
                minLength: {
                  value: 2,
                  message: "Product name must be at least 2 characters"
                },
                maxLength: {
                  value: 100,
                  message: "Product name must not exceed 100 characters"
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Product Name"
                  size="sm"
                  isRequired
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message as string}
                  placeholder="Enter product name"
                  {...field}
                />
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              rules={{ 
                required: "Category selection is required",
                validate: (value) => value !== "0" && value !== 0 || "Please select a valid category"
              }}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Select
                    label="Select Category"
                    variant="faded"
                    size="sm"
                    isRequired
                    isInvalid={!!errors.categoryId}
                    errorMessage={errors.categoryId?.message as string}
                    selectedKeys={field.value ? new Set([String(field.value)]) : new Set([])}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      field.onChange(selectedKey ? Number(selectedKey) : null);
                    }}
                  >
                    <SelectItem key={0}>Select Category</SelectItem>
                    {categoryData?.data?.map((item: any) => (
                      <SelectItem key={item.id}>{item.name}</SelectItem>
                    ))}
                  </Select>
                </div>
              )}
            />

            <Controller
              name="sellingPrice"
              control={control}
              rules={{ 
                required: "Selling Price is required",
                min: {
                  value: 0,
                  message: "Price must be 0 or greater"
                },
                max: {
                  value: 99999999,
                  message: "Price must not exceed ₹99,999,999"
                },
                validate: (value) => {
                  if (isNaN(Number(value))) {
                    return "Price must be a valid number";
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="number"
                  label="Selling Price (₹)"
                  size="sm"
                  isRequired
                  isInvalid={!!errors.sellingPrice}
                  errorMessage={errors.sellingPrice?.message as string}
                  placeholder="Enter selling price"
                  min="0"
                  {...field}
                  onChange={(value) => {
                    // InputNextUI passes the value directly, not an event
                    const stringValue = typeof value === 'string' ? value : String(value || '');
                    const numValue = Number(stringValue);
                    if (stringValue === "" || (!isNaN(numValue) && numValue >= 0 && numValue <= 99999999)) {
                      field.onChange(stringValue === "" ? "" : Number(stringValue));
                    }
                  }}
                />
              )}
            />

            <Controller
              name="currentStock"
              control={control}
              rules={{ 
                required: "Current Stock is required",
                min: {
                  value: 0,
                  message: "Stock must be 0 or greater"
                },
                max: {
                  value: 999999,
                  message: "Stock must not exceed 999,999"
                },
                validate: (value) => {
                  if (!Number.isInteger(Number(value))) {
                    return "Stock must be a whole number";
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="number"
                  label="Current Stock"
                  size="sm"
                  isRequired
                  isInvalid={!!errors.currentStock}
                  errorMessage={errors.currentStock?.message as string}
                  placeholder="Enter stock quantity"
                  min="0"
                  {...field}
                  onChange={(value) => {
                    // InputNextUI passes the value directly, not an event
                    const stringValue = typeof value === 'string' ? value : String(value || '');
                    const numValue = Number(stringValue);
                    if (stringValue === "" || (!isNaN(numValue) && numValue >= 0 && numValue <= 999999)) {
                      field.onChange(stringValue === "" ? "" : Number(stringValue));
                    }
                  }}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{
                maxLength: {
                  value: 500,
                  message: "Description must not exceed 500 characters"
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Description (Optional)"
                  size="sm"
                  isInvalid={!!errors.description}
                  errorMessage={errors.description?.message as string}
                  placeholder="Enter product description (optional)"
                  {...field}
                />
              )}
            />

            <Controller
              name="sku"
              control={control}
              rules={{
                maxLength: {
                  value: 50,
                  message: "SKU must not exceed 50 characters"
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="SKU (Optional - Auto-generated if empty)"
                  size="sm"
                  isInvalid={!!errors.sku}
                  errorMessage={errors.sku?.message as string}
                  placeholder="Enter SKU or leave empty for auto-generation"
                  {...field}
                />
              )}
            />

            <Controller
              name="brand"
              control={control}
              rules={{
                maxLength: {
                  value: 100,
                  message: "Brand name must not exceed 100 characters"
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Brand (Optional)"
                  size="sm"
                  isInvalid={!!errors.brand}
                  errorMessage={errors.brand?.message as string}
                  placeholder="Enter brand name (optional)"
                  {...field}
                />
              )}
            />

            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Select
                    label="Unit (Optional)"
                    variant="faded"
                    size="sm"
                    selectedKeys={field.value ? new Set([String(field.value)]) : new Set(["pcs"])}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      field.onChange(selectedKey || "pcs");
                    }}
                  >
                    <SelectItem key="pcs">Pieces (pcs)</SelectItem>
                    <SelectItem key="kg">Kilogram (kg)</SelectItem>
                    <SelectItem key="g">Gram (g)</SelectItem>
                    <SelectItem key="l">Liter (l)</SelectItem>
                    <SelectItem key="ml">Milliliter (ml)</SelectItem>
                    <SelectItem key="m">Meter (m)</SelectItem>
                    <SelectItem key="cm">Centimeter (cm)</SelectItem>
                    <SelectItem key="box">Box</SelectItem>
                    <SelectItem key="pack">Pack</SelectItem>
                  </Select>
                </div>
              )}
            />

            <Controller
              name="costPrice"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: "Cost price must be 0 or greater"
                },
                validate: (value) => {
                  if (value && isNaN(Number(value))) {
                    return "Cost price must be a valid number";
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="number"
                  label="Cost Price (₹) - Optional"
                  size="sm"
                  isInvalid={!!errors.costPrice}
                  errorMessage={errors.costPrice?.message as string}
                  placeholder="Enter cost price (optional)"
                  min="0"
                  {...field}
                  onChange={(value) => {
                    const stringValue = typeof value === 'string' ? value : String(value || '');
                    const numValue = Number(stringValue);
                    if (stringValue === "" || (!isNaN(numValue) && numValue >= 0)) {
                      field.onChange(stringValue === "" ? "" : Number(stringValue));
                    }
                  }}
                />
              )}
            />

            <Controller
              name="reorderLevel"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: "Reorder level must be 0 or greater"
                },
                validate: (value) => {
                  if (value && !Number.isInteger(Number(value))) {
                    return "Reorder level must be a whole number";
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <InputNextUI
                  type="number"
                  label="Reorder Level - Optional"
                  size="sm"
                  isInvalid={!!errors.reorderLevel}
                  errorMessage={errors.reorderLevel?.message as string}
                  placeholder="Enter reorder level (optional)"
                  min="0"
                  {...field}
                  onChange={(value) => {
                    const stringValue = typeof value === 'string' ? value : String(value || '');
                    const numValue = Number(stringValue);
                    if (stringValue === "" || (!isNaN(numValue) && numValue >= 0)) {
                      field.onChange(stringValue === "" ? "" : Number(stringValue));
                    }
                  }}
                />
              )}
            />

            <Controller
              name="photo"
              control={control}
              rules={{
                validate: (value) => {
                  if (!value && !productId) {
                    return "Product photo is required";
                  }
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
                    Product Photo {!productId && <span className="text-danger">*</span>}
                  </label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      type="file"
                      id="photoFile"
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
                            setSelectedFileName("No file selected");
                            setPhotoPreview(null);
                            field.onChange(null);
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            alert("File size exceeds 2MB. Please select a smaller file.");
                            e.target.value = '';
                            setSelectedFileName("No file selected");
                            setPhotoPreview(null);
                            field.onChange(null);
                            return;
                          }
                          field.onChange(file);
                          setSelectedFileName(file.name);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPhotoPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setSelectedFileName("No file selected");
                          setPhotoPreview(null);
                          field.onChange(null);
                        }
                      }}
                    />
                    <label
                      htmlFor="photoFile"
                      className={`block p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                        errors.photo 
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
                          {selectedFileName}
                        </span>
                        <span className="text-xs text-foreground-400">
                          Click to upload (Max 2MB, Image only)
                        </span>
                      </div>
                    </label>
                  </div>
                  {(photoPreview || (formData.photo && typeof formData.photo === 'string')) && (
                    <div className="mt-2">
                      <Image
                        src={photoPreview || `${infoData.baseApi}/${formData.photo}`}
                        alt="Product Photo Preview"
                        width={150}
                        height={150}
                        className="rounded-lg border border-default-200"
                      />
                    </div>
                  )}
                  {errors.photo && (
                    <p className="text-danger text-tiny mt-1">{errors.photo.message as string}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddClientProduct;

