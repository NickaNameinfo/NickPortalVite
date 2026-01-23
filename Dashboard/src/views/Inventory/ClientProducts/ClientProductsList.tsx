import React from "react";
import { TableList } from "../../../Components/Table/TableList";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  User,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useGetInventoryProductsQuery, useDeleteInventoryProductMutation } from "../Service.mjs";
import { useGetClientsQuery } from "../Service.mjs";
import { infoData } from "../../../configData";
import { getCookie } from "../../../JsFiles/CommonFunction.mjs";

const ClientProductsList = () => {
  const navigate = useNavigate();
  const vendorId = getCookie("vendorId");
  const [selectedClientId, setSelectedClientId] = React.useState<string>("");
  
  // Use new inventory products API that filters by current store/vendor
  const { data: productsData, error, refetch, isLoading } = useGetInventoryProductsQuery({});
  const { data: clientsData } = useGetClientsQuery({});
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteInventoryProductMutation();

  // Filter products by client if client is selected
  // Note: New API may not have clientId, so we'll show all products for now
  // If backend adds clientId filtering, update this logic
  const filteredProducts = React.useMemo(() => {
    if (!productsData?.data) return [];
    // If new API structure doesn't include clientId, return all products
    // Otherwise filter by clientId if selected
    if (!selectedClientId) return productsData.data;
    return productsData.data.filter((product: any) => 
      product.clientId === Number(selectedClientId)
    );
  }, [productsData, selectedClientId]);

  const defaultCloumns = [
    "id",
    "photo",
    "name",
    "client",
    "category",
    "sellingPrice",
    "currentStock",
    "status",
    "actions",
  ];

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "Image", id: "photo", sortable: false },
    { name: "Product Name", id: "name", sortable: true },
    { name: "Client", id: "client", sortable: true },
    { name: "Category", id: "category", sortable: true },
    { name: "Price", id: "sellingPrice", sortable: true },
    { name: "Stock", id: "currentStock", sortable: true },
    { name: "Status", id: "status", sortable: false },
    { name: "Actions", id: "actions" },
  ];

  const renderCell = React.useCallback((product: any, columnKey: string) => {
    const cellValue = product[columnKey];
    switch (columnKey) {
      case "photo":
        return product.photo ? (
          <Image
            src={`${product.photo}`}
            alt={product.name}
            width={50}
            height={50}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="w-[50px] h-[50px] bg-default-200 rounded-lg flex items-center justify-center">
            <span className="text-tiny text-default-400">No Image</span>
          </div>
        );
      case "client":
        const client = clientsData?.data?.find((c: any) => c.id === product.clientId);
        return client ? (
          <User
            name={client.firstName || client.email}
            description={client.email}
            avatarProps={{
              name: client.firstName || client.email,
              src: client.logo ? `${infoData.baseApi}/${client.logo}` : undefined
            }}
          >
            {client.phone || ""}
          </User>
        ) : (
          <span className="text-default-400">N/A</span>
        );
      case "category":
        return product.category ? (
          <Chip size="sm" variant="flat" color="primary">
            {product.category.name}
          </Chip>
        ) : (
          <span className="text-default-400">-</span>
        );
      case "total":
      case "sellingPrice":
        return (
          <Chip size="sm" variant="flat" color="success">
            ₹{cellValue || product.sellingPrice || 0}
          </Chip>
        );
      case "unitSize":
      case "currentStock":
        const stock = Number(cellValue || product.currentStock) || 0;
        return (
          <Chip 
            size="sm" 
            variant="flat" 
            color={stock > 10 ? "success" : stock > 0 ? "warning" : "danger"}
          >
            {stock}
          </Chip>
        );
      case "status":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={product.status === "active" ? "success" : "default"}
          >
            {product.status || "active"}
          </Chip>
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
                  onClick={() => navigate(`/Inventory/ClientProducts/Add/${product.id}`)}
                  key="edit"
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="view"
                  onClick={() => {
                    navigate(`/Inventory/PurchaseList?productId=${product.id}`);
                  }}
                >
                  View Purchases
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                      try {
                        await deleteProduct(product.id).unwrap();
                        alert("Product deleted successfully");
                        refetch();
                      } catch (error: any) {
                        alert(error?.data?.message || error?.message || "Failed to delete product");
                      }
                    }
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue ? cellValue : "-";
    }
  }, [clientsData, navigate, deleteProduct, refetch]);

  return (
    <div className="mx-2">
      <div className="flex justify-between items-center gap-2 my-3">
        <h2 className="text-2xl font-bold">Client Products</h2>
        <div className="flex gap-2">
          <Select
            label="Filter by Client"
            variant="faded"
            size="sm"
            className="w-[200px]"
            selectedKeys={selectedClientId ? new Set([selectedClientId]) : new Set([])}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              setSelectedClientId(selectedKey ? String(selectedKey) : "");
            }}
          >
            <SelectItem key="">All Clients</SelectItem>
            {clientsData?.data?.map((client: any) => (
              <SelectItem key={client.id}>
                {client.firstName || client.email}
              </SelectItem>
            ))}
          </Select>
          <Button
            color="primary"
            onClick={() => navigate("/Inventory/ClientProducts/Add")}
            size="md"
            variant="flat"
          >
            Add Product
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <p className="text-default-500">Loading products...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-danger mb-4">Error loading products: {error?.data?.message || error?.message || "Unknown error"}</p>
          <Button color="primary" onClick={() => refetch()} size="md" variant="flat">
            Retry
          </Button>
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <TableList
          defaultCloumns={defaultCloumns}
          renderCell={renderCell}
          columns={columns}
          tableItems={filteredProducts}
          isStatusFilter={false}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-default-500 mb-4">No products found</p>
          <Button
            color="primary"
            onClick={() => navigate("/Inventory/ClientProducts/Add")}
            size="md"
            variant="flat"
          >
            Add First Product
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientProductsList;

