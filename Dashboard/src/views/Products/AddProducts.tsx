import { useNavigate } from "react-router-dom";
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
} from "./Service.mjs";
import { useGetCategoriesQuery } from "../Categories/Service.mjs";
import { getCookie } from "../.././JsFiles//CommonFunction.mjs";

const AddProducts = () => {
  const { handleSubmit, control, reset,watch } = useForm();
  const currentStoreUserId = getCookie("storeId");
  const currentVendorUserId = getCookie("vendorId");
  const navigate = useNavigate();
  const [addProducts] = useAddProductMutation();
  const [addStoreProducts] = useAddStoreProductMutation();
  const [addVendorProducts] = useAddVendorProductMutation();
  let tempFormData = watch()
  console.log(tempFormData, "watch2451234")
  const {
    data: categoryData,
    error: categoryerror,
    refetch: categoryrefetch,
  } = useGetCategoriesQuery();

  const onSubmit = async (data: any) => {
    let tempData = {
      ...data,
      subCategoryId: 2,
      childCategoryId: 2,
      slug: 1,
      paymentMode : String(tempFormData?.paymentMode || '')
    };
    console.log("datafrom", tempData);
    const formData = new FormData();
    for (const key in tempData) {
      formData.append(key, tempData[key]);
      console.log(formData);
    }
    const result = await addProducts(formData).unwrap();
    if (result?.success) {
      console.log(result, "result3452345");

      const tempStoreValueAPI = {
        supplierId: currentStoreUserId
          ? currentStoreUserId
          : currentVendorUserId,
        productId: result.data?.id,
        unitSize: result.data?.qty,
        buyerPrice: result.data?.total,
      };
      if (currentStoreUserId) {
        const storeResult = await addStoreProducts(tempStoreValueAPI).unwrap();
        console.log(currentStoreUserId, storeResult, "currentUserId");
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
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-wrap gap-4 border-b pb-2 mb-3">
          <Chip color="secondary" variant="dot" className="bg-warning-50">
            Add Products
          </Chip>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <Controller
              name="categoryId" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select label="Select an Category" {...field}>
                  {categoryData?.data?.map((item) => (
                    <SelectItem key={item.id}>{item.name}</SelectItem>
                  ))}
                  {/* <SelectItem key={1}>Category1</SelectItem>
                  <SelectItem key={1}>Category2</SelectItem> */}
                </Select>
              )}
            />
            {/* <Controller
              name="selectedSubCategory" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  type="text"
                  label="selectedSubCategory"
                  size="lg"
                  {...field}
                />
              )}
            />
            <Controller
              name="selectedChildCategory" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  type="text"
                  label="selectedChildCategory"
                  size="lg"
                  {...field}
                />
              )}
            /> */}
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
            <Controller
              name="name" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Name" size="lg" {...field} />
              )}
            />
            {/* <Controller
              name="slug" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="slug" size="lg" {...field} />
              )}
            /> */}
            {/* <Controller
              name="brand" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="brand" size="lg" {...field} />
              )}
            /> */}
            <Controller
              name="status" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select label="Select an Status" {...field}>
                  <SelectItem key={1}>{"Active"}</SelectItem>
                  <SelectItem key={0}>{"InActive"}</SelectItem>
                </Select>
              )}
            />
            <Controller
              name="unit" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Unit" size="lg" {...field} />
              )}
            />
            <Controller
              name="content" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Content" size="lg" {...field} />
              )}
            />
            <Controller
              name="sortDesc" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  type="text"
                  label="Sort Description"
                  size="lg"
                  {...field}
                />
              )}
            />
            {/* <Controller
              name="buyerPrice" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Buyer Price" size="lg" {...field} />
              )}
            /> */}
            <Controller
              name="price" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Price" size="lg" {...field} />
              )}
            />
            <Controller
              name="qty" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Quantity" size="lg" {...field} />
              )}
            />
            <Controller
              name="discount" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Discount(%)" size="lg" {...field} />
              )}
            />
            <Controller
              name="discountPer" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  type="text"
                  label="Discount Price"
                  size="lg"
                  {...field}
                />
              )}
            />
            <Controller
              name="total" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Total" size="lg" {...field} />
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Controller
              name="grand_total" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Grand total" size="lg" {...field} />
              )}
            />
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
        <div className="text-center">
          <Button color="primary" type="submit">
            Add New Product
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AddProducts;
