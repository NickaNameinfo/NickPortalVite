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
import {
  useGetOutboundTransactionsQuery,
  useAddOutboundTransactionMutation,
  useDeleteOutboundTransactionMutation,
} from "../Service.mjs";
import { TableList } from "../../../Components/Table/TableList";
import { useGetCategoriesQuery } from "../../Categories/Service.mjs";
import { useGetProductsQuery } from "../../Products/Service.mjs";
import { useGetVendorsProductByIdQuery } from "../../VendorProducts/Service.mjs";
import { useGetStoresProductByIDQuery } from "../../Store/Service.mjs";
import InputNextUI from "../../../Components/Common/Input/input";
import { getCookie } from "../../../JsFiles/CommonFunction.mjs";
import VendorSelector from "../../../Components/Common/VendorSelector";
import { infoData } from "../../../configData";

const OutboundInventory = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const currentRole = getCookie("role");
  const [selectedVendorId, setSelectedVendorId] = React.useState<number | null>(
    vendorId ? Number(vendorId) : null
  );
  const [selectedVendor, setSelectedVendor] = React.useState<any>(null);
  const [filters, setFilters] = React.useState({
    startDate: "",
    endDate: "",
    productId: "",
    orderId: "",
  });

  const [DeleteData] = useDeleteOutboundTransactionMutation();
  const navigate = useNavigate();

  const queryVendorId = selectedVendorId || vendorId;
  const { data, error, refetch } = useGetOutboundTransactionsQuery(
    {
      ...filters,
    },
    { skip: !queryVendorId }
  );

  const {
    data: categoryData,
    error: categoryerror,
    refetch: categoryrefetch,
  } = useGetCategoriesQuery();

  // Use the same API logic as ProductsList.tsx based on role
  const { data: productsData } = useGetProductsQuery(undefined, {
    skip: !!vendorId || !!storeId,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: vendorProducts,
    error: vendorError,
    refetch: vendorRefetch,
  } = useGetVendorsProductByIdQuery(Number(vendorId), {
    skip: !vendorId,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: storeProducts,
    error: storeProductsError,
    refetch: storeProductsRefetch,
  } = useGetStoresProductByIDQuery(Number(storeId), {
    skip: !storeId,
    refetchOnMountOrArgChange: true,
  });

  // Get the appropriate products data based on role
  const getProductsData = () => {
    if (currentRole === "0") {
      return productsData;
    } else if (currentRole === "2") {
      return vendorProducts;
    } else {
      return storeProducts;
    }
  };

  const finalProductsData = getProductsData();

  const [addOutbound] = useAddOutboundTransactionMutation();
  const [refresh, setRefresh] = React.useState(false);

  React.useEffect(() => {
    if (refresh && queryVendorId) {
      refetch();
      reset();
      setRefresh(false);
    }
  }, [refresh, queryVendorId]);

  React.useEffect(() => {
    if (queryVendorId) {
      refetch();
    }
  }, [selectedVendorId, filters, queryVendorId]);

  const onSubmit = async (formData: any) => {
    if (!selectedVendorId) {
      alert("Please select a vendor");
      return;
    }

    let tempApiParams = {
      ...formData,
      date: formData.date || new Date().toISOString().split("T")[0],
      orderId: formData.orderId || null,
    };
    // Note: vendorId is automatically extracted from authenticated user's session on backend

    const result = await addOutbound(tempApiParams);
    if (result?.data?.success) {
      setRefresh(true);
      refetch();
      reset();
      alert("Outbound transaction added successfully");
    } else {
      alert(result?.error?.data?.message || "Failed to add outbound transaction");
    }
  };

  const defaultColumns = [
    "id",
    "vendor",
    "product",
    "quantity",
    "orderId",
    "date",
    "referenceNumber",
    "actions",
  ];

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "Vendor", id: "vendor", sortable: true },
    { name: "Product", id: "product", sortable: true },
    { name: "Quantity", id: "quantity", sortable: true },
    { name: "Order ID", id: "orderId", sortable: true },
    { name: "Date", id: "date", sortable: true },
    { name: "Reference", id: "referenceNumber", sortable: false },
    { name: "Actions", id: "actions" },
  ];

  const onDelete = async (deleteID: number) => {
    if (deleteID && confirm("Are you sure you want to delete this transaction?")) {
      const result = await DeleteData(deleteID);
      if (result?.data?.success) {
        refetch();
        alert("Transaction deleted successfully");
      } else {
        alert(result?.error?.data?.message || "Failed to delete transaction");
      }
    }
  };

  const renderCell = React.useCallback(
    (items: any, columnKey: string) => {
      const cellValue = items[columnKey];
      switch (columnKey) {
        case "vendor":
          return items?.vendor ? (
            <User
              avatarProps={{
                radius: "lg",
                src: `${infoData.baseApi}/${items.vendor.vendorImage}`,
              }}
              description={items.vendor.email}
              name={items.vendor.storename}
            >
              {items.vendor.storename}
            </User>
          ) : (
            "N/A"
          );
        case "product":
          return items?.product ? (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{items.product.name}</p>
            </div>
          ) : (
            "N/A"
          );
        case "quantity":
          return (
            <Chip size="sm" variant="flat" color="danger">
              {cellValue}
            </Chip>
          );
        case "orderId":
          return items.orderId ? (
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              onClick={() => navigate(`/CustomersOrderList`)}
              className="cursor-pointer"
            >
              #{items.orderId}
            </Chip>
          ) : (
            <span className="text-default-400">N/A</span>
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
                    onClick={() => {
                      onDelete(items?.id);
                    }}
                    className="text-danger"
                    color="danger"
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

  return (
    <div className="mx-1">
      <form onSubmit={handleSubmit(onSubmit)} className="px-2">
        <div className="flex items-center justify-between border-b pb-3 mt-1.5 mb-3">
          <div>
            <Chip
              size="lg"
              className="py-4 px-2"
              classNames={{
                base: "bg-gradient-to-br border-small border-white/60",
                content: "drop-shadow shadow-black text-white",
              }}
              startContent={
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                    fill="red"
                  />
                </svg>
              }
              variant="faded"
              color="default"
            >
              <p className="font-medium text-black/70">Add Outbound Inventory</p>
            </Chip>
          </div>
          <div className="text-center w-[100px]">
            <Button color="primary" size="md" type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          {!vendorId && (
            <div>
              <VendorSelector
                value={selectedVendorId || 0}
                onChange={(value) => {
                  setSelectedVendorId(Number(value));
                }}
                onVendorSelect={setSelectedVendor}
                label="Select Vendor"
                size="sm"
                isRequired
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="productId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label="Select Product"
                  variant="faded"
                  size="sm"
                  placeholder="Choose a product"
                  {...field}
                >
                  <SelectItem key={0}>Select Product</SelectItem>
                  {finalProductsData?.data?.map((item: any) => {
                    // Handle different data structures based on role
                    const product = item?.product || item;
                    const productId = product?.id || item?.id;
                    const productName = product?.name || item?.name;
                    return (
                      <SelectItem key={productId}>{productName}</SelectItem>
                    );
                  })}
                </Select>
              )}
            />

            <Controller
              name="quantity"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field }) => (
                <InputNextUI
                  type="number"
                  label="Quantity"
                  size="sm"
                  min="1"
                  {...field}
                />
              )}
            />

            <Controller
              name="orderId"
              control={control}
              render={({ field }) => (
                <InputNextUI
                  type="number"
                  label="Order ID (Optional)"
                  size="sm"
                  placeholder="Link to order"
                  {...field}
                />
              )}
            />

            <Controller
              name="date"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputNextUI
                  type="date"
                  label="Date"
                  size="sm"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  {...field}
                />
              )}
            />

            <Controller
              name="referenceNumber"
              control={control}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Reference Number"
                  size="sm"
                  placeholder="Optional"
                  {...field}
                />
              )}
            />

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <InputNextUI
                  type="text"
                  label="Notes"
                  size="sm"
                  placeholder="Optional"
                  {...field}
                />
              )}
            />
          </div>
        </div>
      </form>

      {/* Filters */}
      <div className="px-2 mb-4">
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
          <InputNextUI
            type="number"
            label="Order ID"
            size="sm"
            value={filters.orderId}
            onChange={(value) =>
              setFilters({ ...filters, orderId: value })
            }
            placeholder="Filter by order"
          />
          <Button
            size="sm"
            variant="flat"
            onClick={() =>
              setFilters({ startDate: "", endDate: "", productId: "", orderId: "" })
            }
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-2">
        {data && (
          <TableList
            defaultCloumns={defaultColumns}
            renderCell={renderCell}
            columns={columns}
            tableItems={data?.["data"] || []}
            isStatusFilter={false}
          />
        )}
      </div>
    </div>
  );
};

export default OutboundInventory;

