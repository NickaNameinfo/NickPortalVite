import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  DatePicker,
  Input,
} from "@nextui-org/react";
import React from "react";
import { TableList } from "../../Components/Table/TableList";
import { useGetBillsQuery } from "./Service.mjs";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { parseDate, CalendarDate } from "@internationalized/date";

const BillsList = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = React.useState<CalendarDate | null>(null);
  const [endDate, setEndDate] = React.useState<CalendarDate | null>(null);
  
  const { data, error, refetch } = useGetBillsQuery(Number(getCookie("storeId")), {
    refetchOnMountOrArgChange: true,
  });

  // Use sample data if API data is not available
  const billsData = data?.data;

  // Filter bills by date range
  const filteredBillsData = React.useMemo(() => {
    if (!billsData) return [];
    
    if (!startDate && !endDate) {
      return billsData;
    }

    return billsData.filter((bill: any) => {
      if (!bill.createdAt) return false;
      
      const billDate = new Date(bill.createdAt);
      billDate.setHours(0, 0, 0, 0); // Reset time to start of day
      
      if (startDate && endDate) {
        const start = new Date(startDate.year, startDate.month - 1, startDate.day);
        const end = new Date(endDate.year, endDate.month - 1, endDate.day);
        end.setHours(23, 59, 59, 999); // Set to end of day
        return billDate >= start && billDate <= end;
      } else if (startDate) {
        const start = new Date(startDate.year, startDate.month - 1, startDate.day);
        return billDate >= start;
      } else if (endDate) {
        const end = new Date(endDate.year, endDate.month - 1, endDate.day);
        end.setHours(23, 59, 59, 999); // Set to end of day
        return billDate <= end;
      }
      
      return true;
    });
  }, [billsData, startDate, endDate]);

  const handleClearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

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
        <div className="flex gap-2 items-center">
          <Button
            color="primary"
            onClick={() => navigate("/Billing/Add")}
            size="md"
            variant="flat"
          >
            Add New Bill
          </Button>
        </div>
      </div>
      
      {/* Date Range Filter */}
      <div className="flex flex-wrap gap-3 items-end mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            variant="bordered"
            size="sm"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            variant="bordered"
            size="sm"
          />
        </div>
        <Button
          color="default"
          variant="flat"
          size="md"
          onClick={handleClearDateFilter}
          isDisabled={!startDate && !endDate}
        >
          Clear Filter
        </Button>
        {(startDate || endDate) && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredBillsData.length} of {billsData?.length || 0} bills
          </div>
        )}
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
          {filteredBillsData && filteredBillsData.length > 0 ? (
            <TableList
              defaultCloumns={defaultColumns}
              renderCell={renderCell}
              columns={columns}
              tableItems={filteredBillsData}
              isStatusFilter={true}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No bills found for the selected date range
              </p>
            </div>
          )}
        </>
      ) : (
        <p>No bills found</p>
      )}
    </div>
  );
};

export default BillsList;

