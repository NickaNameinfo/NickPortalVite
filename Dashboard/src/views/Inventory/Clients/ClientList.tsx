import React from "react";
import { TableList } from "../../../Components/Table/TableList";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useGetAllUserQuery } from "../../../Service.mjs";
import { useGetClientsQuery, useDeleteClientMutation } from "../Service.mjs";
import { infoData } from "../../../configData";

const ClientList = () => {
  const navigate = useNavigate();
  // Use new client API that filters by current store/vendor
  const { data: clientsData, error, refetch, isLoading } = useGetClientsQuery({});
  // Fallback to old API if new one fails (for backward compatibility)
  const { data: oldData } = useGetAllUserQuery();
  
  // Use new API data if available, otherwise fallback to old API
  const data = clientsData || oldData;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedClient, setSelectedClient] = React.useState<any>(null);
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  const defaultCloumns = [
    "id",
    "logo",
    "firstName",
    "lastName",
    "email",
    "phone",
    "gstNumber",
    "branches",
    "actions",
  ];

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "Logo", id: "logo", sortable: false },
    { name: "First Name", id: "firstName", sortable: true },
    { name: "Last Name", id: "lastName", sortable: true },
    { name: "Email", id: "email", sortable: true },
    { name: "Phone", id: "phone", sortable: true },
    { name: "GST Number", id: "gstNumber", sortable: false },
    { name: "Branches", id: "branches", sortable: false },
    { name: "Actions", id: "actions" },
  ];

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "logo":
        return user.logo ? (
          <Image
            src={`${user.logo}`}
            alt="Client Logo"
            width={50}
            height={50}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="w-[50px] h-[50px] bg-default-200 rounded-lg flex items-center justify-center">
            <span className="text-tiny text-default-400">No Logo</span>
          </div>
        );
      case "firstName":
        return (
          <User
            avatarProps={{ 
              radius: "lg", 
              name: user.firstName || user.email,
              src: user.logo ? `${infoData.baseApi}/${user.logo}` : undefined
            }}
            description={user.email}
            name={user.firstName || user.email}
          >
            {user.email}
          </User>
        );
      case "phone":
        return cellValue ? (
          <Chip size="sm" variant="flat" color="primary">
            {cellValue}
          </Chip>
        ) : (
          <span className="text-default-400">-</span>
        );
      case "gstNumber":
        return cellValue ? (
          <Chip size="sm" variant="flat" color="success">
            {cellValue}
          </Chip>
        ) : (
          <span className="text-default-400">-</span>
        );
      case "branches":
        const branches = typeof user.branches === 'string' 
          ? JSON.parse(user.branches || '[]') 
          : (user.branches || []);
        const branchCount = Array.isArray(branches) ? branches.length : 0;
        return branchCount > 0 ? (
          <div className="flex items-center gap-2">
            <Chip size="sm" variant="flat" color="secondary">
              {branchCount} Branch{branchCount !== 1 ? 'es' : ''}
            </Chip>
            <Button
              size="sm"
              variant="light"
              onClick={() => {
                setSelectedClient({ ...user, branches });
                onOpen();
              }}
            >
              View
            </Button>
          </div>
        ) : (
          <span className="text-default-400">No branches</span>
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
                  onClick={() => navigate(`/Inventory/Clients/Add/${user.id}`)}
                  key="edit"
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="view"
                  onClick={() => {
                    // View client details or purchases
                    navigate(`/Inventory/PurchaseList?clientId=${user.id}`);
                  }}
                >
                  View Purchases
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to delete ${user.firstName || user.email}?`)) {
                      try {
                        await deleteClient(user.id).unwrap();
                        alert("Client deleted successfully");
                        refetch();
                      } catch (error: any) {
                        alert(error?.data?.message || error?.message || "Failed to delete client");
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
  }, [navigate, onOpen, deleteClient, refetch]);

  return (
    <div className="mx-2">
      <div className="flex justify-between items-center gap-2 my-3">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button
          color="primary"
          onClick={() => navigate("/Inventory/Clients/Add")}
          size="md"
          variant="flat"
        >
          Add Client
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <p className="text-default-500">Loading clients...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-danger mb-4">Error loading clients: {error?.data?.message || error?.message || "Unknown error"}</p>
          <Button color="primary" onClick={() => refetch()} size="md" variant="flat">
            Retry
          </Button>
        </div>
      ) : data && data?.data && data.data.length > 0 ? (
        <TableList
          defaultCloumns={defaultCloumns}
          renderCell={renderCell}
          columns={columns}
          tableItems={data.data}
          isStatusFilter={false}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-default-500 mb-4">No clients found</p>
          <Button
            color="primary"
            onClick={() => navigate("/Inventory/Clients/Add")}
            size="md"
            variant="flat"
          >
            Add First Client
          </Button>
        </div>
      )}

      {/* Branches Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Branches - {selectedClient?.firstName || selectedClient?.email}
              </ModalHeader>
              <ModalBody>
                {selectedClient?.branches && Array.isArray(selectedClient.branches) && selectedClient.branches.length > 0 ? (
                  <div className="space-y-4">
                    {selectedClient.branches.map((branch: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Branch {index + 1}: {branch.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {branch.address && (
                            <div>
                              <span className="font-medium">Address: </span>
                              <span>{branch.address}</span>
                            </div>
                          )}
                          {branch.city && (
                            <div>
                              <span className="font-medium">City: </span>
                              <span>{branch.city}</span>
                            </div>
                          )}
                          {branch.phone && (
                            <div>
                              <span className="font-medium">Phone: </span>
                              <span>{branch.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-default-500">No branches added</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ClientList;

