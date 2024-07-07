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
import { useGetStockQuery, useAddStockMutation } from "./Service.mjs";
import { TableList } from "../../../Components/Table/TableList";

const AddStock = () => {
  const { handleSubmit, control, reset } = useForm();
  const navigate = useNavigate();
  const { data, error, refetch } = useGetStockQuery(3);
  const [addStock] = useAddStockMutation();
  const [refresh, setRefresh] = React.useState(false);

  console.log(data, "data5234523452345", data?.data, refresh);

  const onSubmit = async (formData: any) => {
    console.log(formData, "formData3452345234");
    let tempApiParams = {
      ...formData,
      vendorId: 3,
    };
    const result = await addStock(tempApiParams);
    console.log(result?.data, "result3452345");
    if (result) {
      setRefresh(true);
    }
  };

  React.useEffect(() => {
    refetch();
  }, [refresh]);

  React.useEffect(() => {
    setRefresh((prev) => !prev);
  }, [data]);

  const defaultCloumns = ["id", "stock", "actions", "category", "vendor"];

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "stock", id: "stock", sortable: true },
    { name: "category", id: "category", sortable: true },
    { name: "vendor", id: "vendor", sortable: true },
    { name: "Actions", id: "actions" },
  ];

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
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue ? cellValue : "No Data";
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-wrap gap-4 border-b pb-2 mb-3">
          <Chip color="secondary" variant="dot" className="bg-warning-50">
            Add Stock
          </Chip>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Controller
              name="categoryId" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select label="Select an Status" {...field}>
                  <SelectItem key={1}>{"Category1"}</SelectItem>
                  <SelectItem key={1}>{"Category2"}</SelectItem>
                </Select>
              )}
            />
            <Controller
              name="stock" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Stock" size="lg" {...field} />
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

export default AddStock;
