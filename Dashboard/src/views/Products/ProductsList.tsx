import { useGetProductsQuery } from "./Service.mjs";
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
import React from "react";
import { TableList } from "../../Components/Table/TableList";

const ProductsList = () => {
  const { data, error, refetch } = useGetProductsQuery();
  console.log(data, "data769867");
  const defaultCloumns = ["id", "name", "actions", "price", "sortDesc"];
  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "name", id: "name", sortable: true },
    { name: "price", id: "price", sortable: true },
    { name: "sortDesc", id: "sortDesc", sortable: true },
    { name: "Actions", id: "actions" },
  ];

  React.useEffect(() => {
    refetch();
  }, []);

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
      <p>khgjhg</p>
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
  );
};

export default ProductsList;
