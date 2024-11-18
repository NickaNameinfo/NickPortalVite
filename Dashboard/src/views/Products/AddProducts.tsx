import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Select,
  SelectItem,
  User,
} from "@nextui-org/react";
import React from "react";
import {
  useAddProductMutation,
  useAddStoreProductMutation,
  useAddVendorProductMutation,
  useGetProductsByIdQuery,
  useUpdateProductMutation,
} from "./Service.mjs";
import { useGetCategoriesQuery } from "../Categories/Service.mjs";
import { getCookie } from "../.././JsFiles//CommonFunction.mjs";
import InputNextUI from "../../Components/Common/Input/input";
import { infoData } from "../../configData";
import { useGetSubcriptionByCustomerIDQuery } from "../Subscriptions/Service.mjs";
import { useGetVendorsProductByIdQuery } from "../VendorProducts/Service.mjs";
import { useGetStoresProductByIDQuery } from "../Store/Service.mjs";

const AddProducts = () => {
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const currentStoreUserId = getCookie("storeId");
  const currentVendorUserId = getCookie("vendorId");
  const navigate = useNavigate();
  const [addProducts] = useAddProductMutation();
  const [addStoreProducts] = useAddStoreProductMutation();
  const [addVendorProducts] = useAddVendorProductMutation();
  const [updateProducts] = useUpdateProductMutation();
  const { productId } = useParams();
  let tempFormData = watch();
  const {
    data: categoryData,
    error: categoryerror,
    refetch: categoryrefetch,
  } = useGetCategoriesQuery();

  let currentUserId = currentStoreUserId
    ? currentStoreUserId
    : currentVendorUserId;

  let tempEcommereceValues = {
    id: currentUserId,
    subscriptionType: "Plan1",
  };
  const {
    data: ecommereceSubcriptionData,
    error,
    refetch,
  } = useGetSubcriptionByCustomerIDQuery(tempEcommereceValues);

  let temCustomizeValues = {
    id: currentUserId,
    subscriptionType: "Plan2",
  };
  const {
    data: customizeSubcriptionData,
    error: customizeError,
    refetch: customizeRefetch,
  } = useGetSubcriptionByCustomerIDQuery(temCustomizeValues);

  const {
    data: vendorProducts,
    error: vendorError,
    refetch: vendorRefetch,
  } = useGetVendorsProductByIdQuery(Number(currentVendorUserId));

  const {
    data: storeProducts,
    error: storeError,
    refetch: stroeRefetch,
  } = useGetStoresProductByIDQuery(Number(currentStoreUserId));

  const {
    data: productData,
    error: productError,
    refetch: productRefetch,
  } = useGetProductsByIdQuery(productId);

  React.useEffect(() => {
    setValue("paymentMode", ["1", "2", "3"]);
    productRefetch();
    stroeRefetch();
    vendorRefetch();
    customizeRefetch();
  }, []);

  React.useEffect(() => {
    if (productData?.data) {
      reset(productData?.data);
      setValue("grand_total", productData?.data?.total);
      setValue("paymentMode", productData?.data?.paymentMode?.split(","));
      setValue("isEnableCustomize", productData?.data?.isEnableCustomize);
      setValue("isEnableEcommerce", productData?.data?.isEnableEcommerce);
    }
  }, [productData]);

  React.useEffect(() => {
    const discountAmount = (tempFormData?.price * tempFormData?.discount) / 100;
    const discountedPrice = tempFormData?.price - discountAmount;

    setValue("grand_total", Number(discountedPrice * tempFormData?.qty));
    setValue("total", Number(discountedPrice * tempFormData?.qty));
    setValue("discountPer", Number(discountAmount));
  }, [tempFormData?.price, tempFormData?.discount, tempFormData?.qty]);

  const onSubmit = async (data: any) => {
    let tempData = {
      ...data,
      subCategoryId: 3,
      childCategoryId: 3,
      slug: data?.name,
      createdId: currentStoreUserId ? currentStoreUserId : currentVendorUserId,
      createdType: currentStoreUserId ? "Store" : "Vendor",
      paymentMode: String(tempFormData?.paymentMode || ""),
      isEnableCustomize: tempFormData?.isEnableCustomize ? "1" : "0",
      isEnableEcommerce: tempFormData?.isEnableEcommerce ? "1" : "0",
    };
    const formData = new FormData();
    for (const key in tempData) {
      formData.append(key, tempData[key]);
    }
    if (!productData?.data) {
      const result = await addProducts(formData).unwrap();
      if (result?.success) {
        const tempStoreValueAPI = {
          supplierId: currentStoreUserId
            ? currentStoreUserId
            : currentVendorUserId,
          productId: result.data?.id,
          unitSize: result.data?.qty,
          buyerPrice: result.data?.total,
        };
        if (currentStoreUserId) {
          const storeResult = await addStoreProducts(
            tempStoreValueAPI
          ).unwrap();
          if (storeResult) {
            navigate("/ProductsList");
          }
        } else {
          const vendorResult = await addVendorProducts(
            tempStoreValueAPI
          ).unwrap();
          console.log(currentStoreUserId, vendorResult, "currentUserId");
          if (vendorResult) {
            navigate("/ProductsList");
          }
        }
      }
    } else {
      setValue("id", productData?.data?.id);
      const result = await updateProducts(formData).unwrap();
      if (result?.success) {
        navigate("/ProductsList");
      }
    }
  };

  let productListValues =
    vendorProducts?.data?.length > 0
      ? vendorProducts?.data
      : storeProducts?.data;

  const filteredEcommereceData = productListValues?.filter(
    (item) => item.product.isEnableEcommerce === "1"
  );
  const filteredCustomizeData = productListValues?.filter(
    (item) => item.product.isEnableCustomize === 1
  );

  return (
    <div className="mx-3">
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <p className="font-medium  text-black/70">
              {" "}
              {productData?.data ? "Update Product" : "Add Protuct"}
            </p>
          </Chip>
          <Chip variant="flat" color="primary">
            Total Ecommerce Subscription{" "}
            {ecommereceSubcriptionData?.data?.[0]?.subscriptionCount}
          </Chip>
          <Chip variant="flat" color="warning">
            Total Customize Subscription{" "}
            {customizeSubcriptionData?.data?.[0]?.subscriptionCount}
          </Chip>
          <div className="text-center">
            <Button
              color="primary"
              type="submit"
              size="md"
              // className="w-[90px]"
            >
              {productData?.data ? "Update Product" : "Add New Product"}
            </Button>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Controller
              name="categoryId" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please select value" }}
              render={({ field }) => (
                <Select
                  isRequired={true}
                  isInvalid={errors?.["categoryId"] ? true : false}
                  errorMessage={errors?.["categoryId"]?.message}
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
                  label="Select Category"
                  variant="faded"
                  size="sm"
                  {...field}
                  selectedKeys={[String(tempFormData?.categoryId)]}
                >
                  {categoryData?.data?.map((item) => (
                    <SelectItem key={String(item.id)} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>

                // <Select label="Select an Category" {...field}>
                //   {categoryData?.data?.map((item) => (
                //     <SelectItem key={item.id}>{item.name}</SelectItem>
                //   ))}
                // </Select>
              )}
            />
            <Controller
              name="status" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please select value" }}
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
                  label="Status"
                  variant="bordered"
                  size="sm"
                  selectedKeys={String(tempFormData?.status)}
                  {...field}
                  isRequired={true}
                  isInvalid={errors?.["status"] ? true : false}
                  errorMessage={errors?.["status"]?.message}
                >
                  <SelectItem key={1} value={"1"}>
                    {"Active"}
                  </SelectItem>
                  <SelectItem key={0} value={"0"}>
                    {"InActive"}
                  </SelectItem>
                </Select>
              )}
            />
            <Controller
              name="name" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Name"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                  isRequired={true}
                  isInvalid={errors?.["name"] ? true : false}
                  errorMessage={errors?.["name"]?.message}
                />
              )}
            />
            <Controller
              name="unitSize" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Unit"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                  isRequired={true}
                  isInvalid={errors?.["unitSize"] ? true : false}
                  errorMessage={errors?.["unitSize"]?.message}
                />
              )}
            />
            {/* <Controller
              name="content" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Content"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                />
              )}
            /> */}
            <Controller
              name="sortDesc" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Sort Description"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                  isRequired={true}
                  isInvalid={errors?.["sortDesc"] ? true : false}
                  errorMessage={errors?.["sortDesc"]?.message}
                />
              )}
            />

            <Controller
              name="price" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Price"
                  onChange={(value) => {
                    setValue("grand_total", value);
                  }}
                  {...field}
                  isRequired={true}
                  isInvalid={errors?.["price"] ? true : false}
                  errorMessage={errors?.["price"]?.message}
                />
              )}
            />
            <Controller
              name="qty" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Quantity"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                  isRequired={true}
                  isInvalid={errors?.["qty"] ? true : false}
                  errorMessage={errors?.["qty"]?.message}
                />
              )}
            />
            <Controller
              name="discount" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Discoint(%)"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                  isRequired={true}
                  isInvalid={errors?.["discount"] ? true : false}
                  errorMessage={errors?.["discount"]?.message}
                />
              )}
            />
            <Controller
              name="discountPer" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Discount Price"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                  isDisabled
                  isRequired={true}
                  isInvalid={errors?.["discountPer"] ? true : false}
                  errorMessage={errors?.["discountPer"]?.message}
                />
              )}
            />
            <Controller
              name="total" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Total"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  isDisabled
                  {...field}
                />
              )}
            />
            <Controller
              name="grand_total" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Grant total"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  isDisabled
                  {...field}
                />
              )}
            />

            <div className="flex">
              <Controller
                name="photo" // Changed to reflect a text input
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
                        document.getElementById("fileLabel").innerText = e
                          .target.files[0]
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
              {/* {productData?.data?.photo && ( */}
              <Image
                src={`${infoData.baseApi}/${productData?.data?.photo}`}
                className="h-20 ml-2"
                width={100}
              />
              {/* )} */}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Controller
              name="paymentMode" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <CheckboxGroup
                  label="Select Payment Type"
                  orientation="horizontal"
                  color="secondary"
                  {...field}
                  defaultValue={["1", "2", "3"]}
                >
                  <Checkbox value="1">Per Order</Checkbox>
                  <Checkbox value="2">Online Payment</Checkbox>
                  <Checkbox value="3">Cash on Delivery</Checkbox>
                </CheckboxGroup>
              )}
            />
            <div className="w-100">
              <h3 className="mb-1">Subcriptions</h3>
              <div className="mb-3 flex">
                <Controller
                  name="isEnableEcommerce"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      isSelected={
                        String(tempFormData?.isEnableEcommerce) === "1"
                          ? true
                          : false
                      }
                      checked={field.value === "1"} // Set checked based on the field's value
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "1" : "0")
                      } // Update value on change
                      isDisabled={
                        !ecommereceSubcriptionData?.data?.[0]
                          ?.subscriptionCount ||
                        String(productData?.data?.isEnableEcommerce) === "1" ||
                        Number(
                          ecommereceSubcriptionData?.data?.[0]
                            ?.subscriptionCount
                        ) -
                          filteredEcommereceData?.length <=
                          0
                      }
                    >
                      Enable Ecommerce
                      <span className="ml-2">
                        <Chip variant="flat" color="primary">
                          {Number(
                            ecommereceSubcriptionData?.data?.[0]
                              ?.subscriptionCount
                          ) - filteredEcommereceData?.length}
                        </Chip>
                      </span>
                    </Checkbox>
                  )}
                />
                <span className="ml-3">
                  <Controller
                    name="isEnableCustomize"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={
                          String(tempFormData?.isEnableCustomize) === "1"
                            ? true
                            : false
                        }
                        checked={field.value === "1"} // Set checked based on the field's value
                        onChange={(e) =>
                          field.onChange(e.target.checked ? "1" : "0")
                        } // Update value on change
                        isDisabled={
                          !customizeSubcriptionData?.data?.[0]
                            ?.subscriptionCount ||
                          String(productData?.data?.isEnableCustomize) ===
                            "1" ||
                          Number(
                            customizeSubcriptionData?.data?.[0]
                              ?.subscriptionCount
                          ) -
                            filteredCustomizeData?.length <=
                            0
                        }
                      >
                        Enable Customize{" "}
                        <span>
                          <Chip variant="flat" color="primary">
                            {Number(
                              customizeSubcriptionData?.data?.[0]
                                ?.subscriptionCount
                            ) - filteredCustomizeData?.length}
                          </Chip>
                        </span>
                      </Checkbox>
                    )}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddProducts;
