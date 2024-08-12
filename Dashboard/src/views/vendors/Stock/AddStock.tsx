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
import {
  useGetStockQuery,
  useAddStockMutation,
  useDeleteStockMutation,
} from "./Service.mjs";
import { TableList } from "../../../Components/Table/TableList";
import { useGetCategoriesQuery } from "../../Categories/Service.mjs";
import InputNextUI from "../../../Components/Common/Input/input";

const AddStock = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const formData = watch();
  console.log(formData, "formDatakmsfskdlfksfdsdf");
  const [DeleteData] = useDeleteStockMutation();
  const navigate = useNavigate();
  const { data, error, refetch } = useGetStockQuery(3);
  const {
    data: categoryData,
    error: categoryerror,
    refetch: categoryrefetch,
  } = useGetCategoriesQuery();
  console.log(categoryData?.data, "categoryDatakdsflj");

  const [addStock] = useAddStockMutation();
  const [refresh, setRefresh] = React.useState(false);

  console.log(data, "data5234523452345", data?.data, refresh);
  React.useEffect(() => {
    if (refresh) {
      refetch();
      setValue("categoryId", 0);
      setValue("stock", "");
      setRefresh(false);
    }
  }, [refresh]);

  React.useEffect(() => {
    setRefresh((prev) => !prev);
  }, [data]);

  const onSubmit = async (formData: any) => {
    console.log(formData, "formData3452345234");
    let tempApiParams = {
      ...formData,
      vendorId: 7,
    };
    const result = await addStock(tempApiParams);
    console.log(result?.data?.success, "result3452345");
    if (result?.data?.success) {
      setRefresh(true);
    }
  };

  const defaultCloumns = ["id", "stock", "actions", "category", "vendor"];

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "stock", id: "stock", sortable: true },
    { name: "category", id: "category", sortable: true },
    { name: "vendor", id: "vendor", sortable: true },
    { name: "Actions", id: "actions" },
  ];

  const onDelete = async (deleteID) => {
    if (deleteID) {
      const result = await DeleteData(deleteID);
      console.log(result, "DeleteData");

      if (result?.data?.success) {
        refetch();
      }
    }
  };

  const renderCell = React.useCallback((items, columnKey, vendor) => {
    const cellValue = items[columnKey];
    console.log(items, "vendor34254");
    switch (columnKey) {
      case "category":
        return (
          <User
            avatarProps={{ radius: "lg", src: items?.category.email }}
            description={items?.category.name}
            name={items?.category.name}
          >
            {items?.category.name}
          </User>
        );
      case "vendor":
        return (
          <User
            avatarProps={{ radius: "lg", src: items?.vendor.storename }}
            description={items?.vendor.storename}
            name={items?.vendor.storename}
          >
            {vendor?.vendor.storename}
          </User>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="flat">
                  action
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {/* <DropdownItem>View</DropdownItem> */}
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onDelete(items?.id);
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue ? cellValue : "No Data";
    }
  }, []);

  return (
    <div className="mx-1">
      <form onSubmit={handleSubmit(onSubmit)} className="px-2">
        <div className="flex items-center justify-between border-b pb-3 mt-1.5  mb-3">
          <div>
            <Chip
              size="lg"
              className="py-4 px-2"
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
              <p className="font-medium  text-black/70">Add Stock</p>
            </Chip>
          </div>
          <div className="text-center w-[100px]">
            <Button color="primary" size="md" type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-0.5">
            <Controller
              name="categoryId" // Changed to reflect a text input
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
                  label="Select Category"
                  variant="faded"
                  size="sm"
                  {...field}
                >
                  <SelectItem key={0}>{"Select Category"}</SelectItem>
                  {categoryData?.data?.map((item) => (
                    <SelectItem key={item.id}>{item.name}</SelectItem>
                  ))}
                  {/* <SelectItem key={1}>{"Category1"}</SelectItem>
                  <SelectItem key={1}>{"Category2"}</SelectItem> */}
                </Select>
              )}
            />
            <Controller
              name="stock" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI type="text" label="Stock" size="sm" {...field} />
                // <Input type="text" label="Stock" size="lg" {...field} />
              )}
            />
          </div>
        </div>
        {/* <div className="text-center">
          <Button color="primary" type="submit">
            Submit
          </Button>
        </div> */}
      </form>
      <div className="px-2">
        {data && (
          <TableList
            defaultCloumns={defaultCloumns}
            renderCell={renderCell}
            columns={columns}
            tableItems={data?.["data"]}
            isStatusFilter={false}
          />
        )}
      </div>
    </div>
  );
};

export default AddStock;
