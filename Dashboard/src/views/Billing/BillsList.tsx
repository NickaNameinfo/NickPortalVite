import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React from "react";
import { TableList } from "../../Components/Table/TableList";
import { useGetBillsQuery } from "./Service.mjs";
import { useNavigate } from "react-router-dom";

const BillsList = () => {
  const navigate = useNavigate();
  const { data, error, refetch } = useGetBillsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Use sample data if API data is not available
  const billsData = data?.data;

  const defaultColumns = [
    "id",
    "customerName",
    "total",
    "subtotal",
    "discount",
    "tax",
    "createdAt",
    "actions",
  ];

  const columns = [
    { name: "Bill ID", id: "id", sortable: true },
    { name: "Customer Name", id: "customerName", sortable: true },
    { name: "Subtotal", id: "subtotal", sortable: true },
    { name: "Discount", id: "discount", sortable: true },
    { name: "Tax", id: "tax", sortable: true },
    { name: "Total", id: "total", sortable: true },
    { name: "Date", id: "createdAt", sortable: true },
    { name: "Action", id: "actions", sortable: false },
  ];

  const renderCell = React.useCallback((data: any, columnKey: string) => {
    switch (columnKey) {
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
                <DropdownItem
                  onClick={() => navigate(`/Billing/View/${data.id}`)}
                >
                  View
                </DropdownItem>
                {/* <DropdownItem
                  onClick={() => navigate(`/Billing/Edit/${data.id}`)}
                >
                  Edit
                </DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "total":
      case "subtotal":
      case "discount":
      case "tax":
        return (
          <span className="font-medium">₹{Number(data[columnKey]).toFixed(2)}</span>
        );
      case "createdAt":
        return (
          <span>
            {data[columnKey]
              ? new Date(data[columnKey]).toLocaleDateString()
              : "-"}
          </span>
        );
      default:
        return data[columnKey] || "-";
    }
  }, []);

  return (
    <div className="mx-2">
      <div className="flex justify-between items-center gap-2 my-3">
        <h2 className="text-2xl font-bold">Bills</h2>
        <Button
          color="primary"
          onClick={() => navigate("/Billing/Add")}
          size="md"
          variant="flat"
        >
          Add New Bill
        </Button>
      </div>
      {billsData && billsData.length > 0 ? (
        <>
          {!data?.data && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Displaying sample data. Connect to API to see real bills.
              </p>
            </div>
          )}
          <TableList
            defaultCloumns={defaultColumns}
            renderCell={renderCell}
            columns={columns}
            tableItems={billsData}
            isStatusFilter={false}
          />
        </>
      ) : (
        <p>No bills found</p>
      )}
    </div>
  );
};

export default BillsList;

