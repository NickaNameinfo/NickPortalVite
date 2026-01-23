import React from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Card,
  CardBody,
  CardHeader,
  User,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  useGetInboundTransactionsQuery,
  useDeleteInboundTransactionMutation,
} from "../Service.mjs";
import { TableList } from "../../../Components/Table/TableList";
import { 
  useGetInventoryProductsQuery,
  useGetClientsQuery 
} from "../Service.mjs";
import InputNextUI from "../../../Components/Common/Input/input";
import { getCookie } from "../../../JsFiles/CommonFunction.mjs";
import { useNavigate } from "react-router-dom";
import { infoData } from "../../../configData";

const PurchaseList = () => {
  const vendorId = getCookie("vendorId");
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState({
    startDate: "",
    endDate: "",
    productId: "",
    clientId: "",
  });

  const [DeleteData] = useDeleteInboundTransactionMutation();

  const { data, error, refetch, isLoading } = useGetInboundTransactionsQuery(
    {
      ...filters,
    }
  );

  // Use new inventory products API that filters by current store/vendor
  const { 
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError 
  } = useGetInventoryProductsQuery({});

  // Use new clients API that filters by current store/vendor
  const { 
    data: clientsData,
    isLoading: isLoadingClients,
    error: clientsError 
  } = useGetClientsQuery({});

  // Debug: Log inbound transactions data
  React.useEffect(() => {
    if (data) {
      console.log("Inbound Transactions Data:", data);
      console.log("Inbound Transactions Array:", data?.data);
      console.log("Inbound Transactions Count:", data?.data?.length);
    }
    if (error) {
      console.error("Inbound Transactions Error:", error);
      console.error("Inbound Transactions Error Details:", error?.data || error?.message);
    }
  }, [data, error]);

  React.useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const defaultColumns = [
    "id",
    "client",
    "product",
    "quantity",
    "invoiceNumber",
    "date",
    "referenceNumber",
    "notes",
    "actions",
  ];

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "Client", id: "client", sortable: true },
    { name: "Product", id: "product", sortable: true },
    { name: "Quantity", id: "quantity", sortable: true },
    { name: "Invoice Number", id: "invoiceNumber", sortable: true },
    { name: "Date", id: "date", sortable: true },
    { name: "Reference", id: "referenceNumber", sortable: false },
    { name: "Notes", id: "notes", sortable: false },
    { name: "Actions", id: "actions" },
  ];

  const onDelete = async (deleteID: number) => {
    if (deleteID && confirm("Are you sure you want to delete this purchase record?")) {
      try {
        await DeleteData(deleteID).unwrap();
        refetch();
        alert("Purchase record deleted successfully");
      } catch (error: any) {
        alert(error?.data?.message || error?.message || "Failed to delete purchase record");
      }
    }
  };

  const renderCell = React.useCallback(
    (items: any, columnKey: string) => {
      const cellValue = items[columnKey];
      switch (columnKey) {
        case "client":
          return items?.client ? (
            <User
              name={items.client.firstName || items.client.email}
              description={items.client.email}
              avatarProps={{
                name: items.client.firstName || items.client.email,
              }}
            >
              {items.client.phone || ""}
            </User>
          ) : (
            <span className="text-default-400">N/A</span>
          );
        case "product":
          return items?.product ? (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{items.product.name}</p>
              {items.product.photo && (
                <p className="text-tiny text-default-400">ID: {items.product.id}</p>
              )}
            </div>
          ) : (
            "N/A"
          );
        case "invoiceNumber":
          return items.invoiceNumber ? (
            <div className="flex flex-col gap-1">
              <Chip size="sm" variant="flat" color="secondary">
                {items.invoiceNumber}
              </Chip>
              {items.invoice && (
                <a
                  href={`${items.invoice}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-tiny underline"
                >
                  View Invoice
                </a>
              )}
            </div>
          ) : (
            <span className="text-default-400">-</span>
          );
        case "quantity":
          return (
            <Chip size="sm" variant="flat" color="success">
              {cellValue}
            </Chip>
          );
        case "date":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{new Date(cellValue).toLocaleDateString()}</p>
            </div>
          );
        case "referenceNumber":
          return cellValue ? (
            <Chip size="sm" variant="flat" color="default">
              {cellValue}
            </Chip>
          ) : (
            <span className="text-default-400">-</span>
          );
        case "notes":
          return cellValue ? (
            <p className="text-small text-default-600 max-w-[200px] truncate">
              {cellValue}
            </p>
          ) : (
            <span className="text-default-400">-</span>
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
                  <DropdownItem
                    onClick={() => navigate(`/Inventory/Inbound?id=${items?.id}`, { state: { transactionData: items } })}
                    key="edit"
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      onDelete(items?.id);
                    }}
                    className="text-danger"
                    color="danger"
                    key="delete"
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue ? cellValue : "No Data";
      }
    },
    []
  );

  // Calculate summary statistics
  const totalQuantity = data?.data?.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0) || 0;
  const totalTransactions = data?.data?.length || 0;
  const uniqueProducts = new Set(data?.data?.map((item: any) => item.productId)).size || 0;

  return (
    <div className="mx-1">
      <div className="px-2 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Purchase List</h2>
          <Button
            color="primary"
            onClick={() => navigate("/Inventory/Inbound")}
            size="md"
            variant="flat"
          >
            Add Purchase
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md">Total Purchases</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-2xl font-bold text-primary">
                {totalTransactions}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md">Total Quantity</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-2xl font-bold text-success">
                {totalQuantity}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md">Unique Products</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-2xl font-bold">
                {uniqueProducts}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-4">
            <InputNextUI
              type="date"
              label="Start Date"
              size="sm"
              value={filters.startDate}
              onChange={(value) =>
                setFilters({ ...filters, startDate: value })
              }
            />
            <InputNextUI
              type="date"
              label="End Date"
              size="sm"
              value={filters.endDate}
              onChange={(value) =>
                setFilters({ ...filters, endDate: value })
              }
            />
            <Select
              label="Filter by Client"
              variant="faded"
              size="sm"
              isLoading={isLoadingClients}
              selectedKeys={filters.clientId ? new Set([String(filters.clientId)]) : new Set([])}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setFilters({ ...filters, clientId: selectedKey ? String(selectedKey) : "" });
              }}
            >
              <SelectItem key="">All Clients</SelectItem>
              {clientsError ? (
                <SelectItem key="error" isDisabled>
                  Error loading clients
                </SelectItem>
              ) : clientsData?.data && Array.isArray(clientsData.data) && clientsData.data.length > 0 ? (
                clientsData.data.map((client: any) => (
                  <SelectItem key={client.id}>
                    {client.firstName || client.email}
                  </SelectItem>
                ))
              ) : !isLoadingClients ? (
                <SelectItem key="empty" isDisabled>
                  No clients available
                </SelectItem>
              ) : null}
            </Select>
            <Button
              size="sm"
              variant="flat"
              onClick={() => setFilters({ startDate: "", endDate: "", productId: "", clientId: "" })}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Purchase List Table */}
      <div className="px-2">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <p className="text-default-500">Loading purchase records...</p>
          </div>
        ) : error ? (
          <Card>
            <CardBody>
              <div className="flex flex-col items-center justify-center p-8">
                <p className="text-danger mb-4">
                  Error loading purchase records: {error?.data?.message || error?.message || "Unknown error"}
                </p>
                <Button
                  color="primary"
                  onClick={() => refetch()}
                  size="md"
                  variant="flat"
                >
                  Retry
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : data && data.data && Array.isArray(data.data) && data.data.length > 0 ? (
          <TableList
            defaultCloumns={defaultColumns}
            renderCell={renderCell}
            columns={columns}
            tableItems={data.data}
            isStatusFilter={false}
          />
        ) : (
          <Card>
            <CardBody>
              <div className="flex flex-col items-center justify-center p-8">
                <p className="text-default-500 mb-2">No purchase records found</p>
                <p className="text-tiny text-default-400 mb-4">
                  {filters.startDate || filters.endDate || filters.clientId 
                    ? "Try adjusting your filters" 
                    : "Add your first purchase record using the button above"}
                </p>
                <Button
                  color="primary"
                  onClick={() => navigate("/Inventory/Inbound")}
                  size="md"
                  variant="flat"
                  className="mt-4"
                >
                  Add First Purchase
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PurchaseList;

