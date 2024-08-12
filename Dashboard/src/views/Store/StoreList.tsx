import React from "react";
import { TableList } from "../../Components/Table/TableList";
import { useGetStoreQuery, useDeleteStoreMutation } from "./Service.mjs";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const StoreList = () => {
  const navigate = useNavigate();

  const [DeleteData] = useDeleteStoreMutation();
  const { data, error, refetch } = useGetStoreQuery();
  console.log(data, "useGetStoreQuery");

  const defaultCloumns = [
    "storename",
    "storeaddress",
    "ownername",
    "phone",
    "email",
    "actions",
  ];

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "storename", id: "storename", sortable: true },
    { name: "storeaddress", id: "storeaddress", sortable: true },
    { name: "email", id: "email", sortable: true },
    { name: "phone", id: "phone" },
    { name: "Actions", id: "actions" },
  ];

  const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

  const onDelete = async (deleteID) => {
    console.log(deleteID, "deleteID");

    if (deleteID) {
      const result = await DeleteData(deleteID);
      console.log(result, "DeleteData");
      if (result?.data?.success) {
        refetch();
      }
    }
  };

  const renderCell = React.useCallback((user, columnKey) => {
    console.log(user, columnKey, "asdfoij89wernk");

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
          size="lg"
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
                {/* <DropdownItem>View</DropdownItem> */}
                <DropdownItem
                  onClick={() => {
                    navigate(`/Stores/Edit/${user?.id}`);
                  }}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onDelete(user?.id);
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="mx-2">
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

export default StoreList;
