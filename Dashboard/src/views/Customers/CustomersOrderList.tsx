import React from "react";
import { TableList } from "../../Components/Table/TableList";
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
import {useGetAllOrderListQuery} from "../../Service.mjs"

const CustomersOrderList = () => {
  const navigate = useNavigate();
  const { data, error, refetch } = useGetAllOrderListQuery();

  const defaultCloumns = [
    "custId",
    "paymentmethod",
    "deliverydate",
    "grandtotal",
    "status",
    "productIds",
    "qty",
    "actions"
  ];

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "custId", id: "custId", sortable: true },
    { name: "paymentmethod", id: "paymentmethod", sortable: true },
    { name: "deliverydate", id: "deliverydate" },
    { name: "grandtotal", id: "grandtotal" },
    { name: "status", id: "status" },
    { name: "productIds", id: "productIds" },
    { name: "qty", id: "qty" },
    { name: "Actions", id: "actions" },
  ];

  const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

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
          size="lg"
            variant="flat"
          >
            {cellValue}
          </Chip>
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

export default CustomersOrderList;
