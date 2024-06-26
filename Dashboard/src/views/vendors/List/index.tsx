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
  console.log(data, "data5234523452345", data?.["data"]?.["data"]);

  React.useEffect(() => {
    refetch();
  }, []);

  const defaultCloumns = [
    "vendor_name",
    "contact_person",
    "email_address",
    "actions",
  ];

  const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "vendor_name", id: "vendor_name", sortable: true },
    { name: "contact_person", id: "contact_person", sortable: true },
    { name: "email_address", id: "email_address", sortable: true },
    { name: "phone_number", id: "phone_number" },
    { name: "alternative_number", id: "alternative_number" },
    { name: "tax_id", id: "tax_id", sortable: true },
    { name: "status", id: "status", sortable: true },
    { name: "Actions", id: "actions" },
  ];

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "vendor_name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.team}
            </p>
          </div>
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
          tableItems={data?.["data"]?.["data"]}
        />
      )}
    </div>
  );
};

export default List;
