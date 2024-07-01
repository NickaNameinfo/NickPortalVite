import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
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
import { useAddProductMutation } from "./Service.mjs";

const AddProducts = () => {
  const { handleSubmit, control, reset } = useForm();

  const navigate = useNavigate();
  const [addProducts] = useAddProductMutation();

  const onSubmit = async (data: any) => {
    let tempData = {
      ...data,
      subCategoryId: 5,
      childCategoryId: 4,
      slug: "test1",
    };
    console.log("datafrom data form", tempData);
    const formData = new FormData();
    for (const key in tempData) {
      formData.append(key, tempData[key]);
      console.log(formData);
    }
    const result = await addProducts(formData);
    console.log(result?.data, "result3452345");
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
              name="selectedCategory" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select label="Select an Status" {...field}>
                  <SelectItem key={10}>Category1</SelectItem>
                  <SelectItem key={2}>Category2</SelectItem>
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
            <Controller
              name="grand_total" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Grand total" size="lg" {...field} />
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