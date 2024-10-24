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
  User,
} from "@nextui-org/react";
import { TableList } from "../../Components/Table/TableList";
import React from "react";
import { useGetCategoriesQuery, useAddCategoriesMutation } from "./Service.mjs";
import InputNextUI from "../../Components/Common/Input/input";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
const CategoriesAdd = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const id = getCookie("id");
  const { data, error, refetch } = useGetCategoriesQuery();
  const [addCategories] = useAddCategoriesMutation();
  const [refresh, setRefresh] = React.useState(false);

  const onSubmit = async (formData: any) => {
    let tempApiParams = {
      ...formData,
      slug: formData.name,
      createdId: id ? id : vendorId ? vendorId : storeId,
      createdType: vendorId ? "Vendor" : "Store",
    };
    const result = await addCategories(tempApiParams);
    if (result?.data) {
      setRefresh(true);
      refetch();
    } else {
      alert(result?.error?.data?.message);
    }
  };

  React.useEffect(() => {
    refetch();
  }, [refresh]);

  React.useEffect(() => {
    setRefresh((prev) => !prev);
  }, [data]);

  const defaultCloumns = ["id", "name", "createdType"];

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "name", id: "name", sortable: true },
    { name: "Created Type", id: "createdType", sortable: true },
    // { name: "Actions", id: "actions" },
  ];

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "storename":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="flat">
                  Action
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="px-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between border-b pb-3 mt-1.5  mb-3">
          <Chip
            size="lg"
            classNames={{
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
            <p className="font-medium  text-black/70"> Add Categories</p>
          </Chip>

          <div className="text-center">
            <Button
              color="primary"
              type="submit"
              size="md"
              className="w-[90px]"
            >
              Submit
            </Button>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-0.5">
            <Controller
              name="name" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please enter value" }}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Name"
                  size="sm"
                  {...field}
                  isRequired={true}
                  isInvalid={errors?.["name"] ? true : false}
                  errorMessage={errors?.["name"]?.message}
                />
              )}
            />
            {/* <Controller
              name="slug" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Slug"
                  size="sm"
                  value={}
                  isDisabled
                  {...field}
                />
              )}
            /> */}
          </div>
        </div>
      </form>
      <div>
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

export default CategoriesAdd;
