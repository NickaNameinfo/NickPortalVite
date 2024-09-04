import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
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

const AddProducts = () => {
  const { handleSubmit, control, reset, watch, setValue } = useForm();
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
  const {
    data: productData,
    error: productError,
    refetch: productRefetch,
  } = useGetProductsByIdQuery(productId);

  const onSubmit = async (data: any) => {
    let tempData = {
      ...data,
      subCategoryId: 3,
      childCategoryId: 3,
      slug:
        data?.name + currentStoreUserId
          ? currentStoreUserId
          : currentVendorUserId,
      createdId: currentStoreUserId ? currentStoreUserId : currentVendorUserId,
      createdType: currentStoreUserId ? "Store" : "Vendor",
      paymentMode: String(tempFormData?.paymentMode || ""),
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

  React.useEffect(() => {
    if (productData?.data) {
      reset(productData?.data);
      setValue("grand_total", productData?.data?.total);
      setValue("paymentMode", productData?.data?.paymentMode?.split(","));
    }
  }, [productData]);

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
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  defaultSelectedKeys={String(productData?.data?.categoryId)}
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
                >
                  {categoryData?.data?.map((item) => (
                    <SelectItem key={item.id}>{item.name}</SelectItem>
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
              name="name" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Name"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                />
              )}
            />

            <Controller
              name="status" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
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
                  variant="faded"
                  size="sm"
                  selectedKeys={String(tempFormData?.status)}
                  {...field}
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
              name="unitSize" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Unit"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
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
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Sort Description"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                />
              )}
            />

            <Controller
              name="price" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Price"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                />
              )}
            />
            <Controller
              name="qty" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Quantity"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                />
              )}
            />
            <Controller
              name="discount" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Discoint(%)"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                />
              )}
            />
            <Controller
              name="discountPer" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Discount Price"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                />
              )}
            />
            <Controller
              name="total" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Total"
                  onChange={(value) => {
                    console.log(value, "ownername");
                  }}
                  {...field}
                />
              )}
            />
            <div className="flex">
              <Controller
                name="photo" // Changed to reflect a text input
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    type="file"
                    label="Image"
                    size="lg"
                    onChange={(e) => {
                      field.onChange(e.target.files[0]); // Don't forget to call field.onChange to update the form state
                    }}
                  />
                )}
              />
              <Image
                src={`${infoData.baseApi}/${productData?.data?.photo}`}
                className="h-fit"
                width={100}
              />
            </div>
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
                  {...field}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Controller
              name="paymentMode" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
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
          </div>
        </div>
        {/* <div className="text-center">
          <Button color="primary" type="submit">
            Add New Product
          </Button>
        </div> */}
      </form>
    </div>
  );
};
export default AddProducts;
