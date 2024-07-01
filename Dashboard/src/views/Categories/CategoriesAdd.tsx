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

const CategoriesAdd = () => {
  const { handleSubmit, control, reset } = useForm();
  const navigate = useNavigate();
  const { data, error, refetch } = useGetCategoriesQuery();
  const [addCategories] = useAddCategoriesMutation();
  const [refresh, setRefresh] = React.useState(false);

  console.log(data, "data5234523452345", data?.data, refresh);

  const onSubmit = async (formData: any) => {
    console.log(formData, "formData3452345234");
    const result = await addCategories(formData);
    console.log(result?.data, "result3452345");
    if (result) {
      setRefresh(true);
      reset();
    }
  };

  React.useEffect(() => {
    refetch();
  }, [refresh]);

  React.useEffect(() => {
    setRefresh((prev) => !prev);
  }, [data]);

  const defaultCloumns = ["id", "name", "actions"];

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "name", id: "name", sortable: true },
    { name: "Actions", id: "actions" },
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
                  action
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-wrap gap-4 border-b pb-2 mb-3">
          <Chip color="secondary" variant="dot" className="bg-warning-50">
            Add Categories
          </Chip>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Controller
              name="name" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Name" size="lg" {...field} />
              )}
            />
            <Controller
              name="slug" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Slug" size="lg" {...field} />
              )}
            />
          </div>
        </div>
        <div className="text-center">
          <Button color="primary" type="submit">
            Submit
          </Button>
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
