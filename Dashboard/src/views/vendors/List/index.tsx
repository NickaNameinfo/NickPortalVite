"use client";
import React from "react";
import { useGetVendorsQuery } from "../Service.mjs";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { TableList } from "../../../Components/Table/TableList";

const List = () => {
  const { data, error, refetch } = useGetVendorsQuery();
  console.log(data, "data5234523452345", data?.["data"]);

  React.useEffect(() => {
    refetch();
  }, []);

  const defaultCloumns = [
    "storename",
    "shopaddress",
    "ownername",
    "phone",
    "email",
    "actions",
  ];

  const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "storename", id: "storename", sortable: true },
    { name: "shopaddress", id: "shopaddress", sortable: true },
    { name: "email", id: "email", sortable: true },
    { name: "phone", id: "phone" },
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
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
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

export default List;
