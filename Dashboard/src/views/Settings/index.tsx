import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Select,
  SelectItem,
  Button,
  Chip,
  Tabs,
  Tab,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@nextui-org/react";
import { useGetStoreQuery } from "../Store/Service.mjs";
import {
  useGetStoreMenuPermissionsQuery,
  useUpdateStoreMenuPermissionMutation,
  useGetSubUsersQuery,
  useCreateSubUserMutation,
  useUpdateSubUserMutation,
  useDeleteSubUserMutation,
  useGetSubUserMenuPermissionsQuery,
  useUpdateSubUserMenuPermissionMutation,
  useGetPendingSubUsersQuery,
  useGetAllApprovedSubUsersQuery,
  useGetSubUsersSummaryQuery,
  useApproveSubUserMutation,
  useRejectSubUserMutation,
} from "./Service.mjs";
import { useGetVendorsQuery } from "../vendors/Service.mjs";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { Controller, useForm } from "react-hook-form";
import { useAppSelector } from "../../Common/hooks";

// Define all available menu items
const MENU_ITEMS = [
  { key: "Vendors", name: "Vendors" },
  { key: "Vendor", name: "Vendor" },
  { key: "Stores", name: "Stores" },
  { key: "Categories", name: "Categories" },
  { key: "Products", name: "Products" },
  { key: "Customer", name: "Customer" },
  { key: "Subscriptions", name: "Subscriptions" },
  { key: "Orders", name: "Orders" },
  { key: "Inventory", name: "Inventory" },
  { key: "Billing", name: "Billing" },
  { key: "Settings", name: "Settings" },
];

const Settings = () => {
  const currentRole = getCookie("role");
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const [selectedStoreId, setSelectedStoreId] = React.useState<string>("");
  const [selectedSubUserId, setSelectedSubUserId] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState<string>("store-permissions");
  
  // Admin: Filters for approved sub-users
  const [filterStoreId, setFilterStoreId] = React.useState<string>("");
  const [filterVendorId, setFilterVendorId] = React.useState<string>("");
  const [filterStatus, setFilterStatus] = React.useState<string>("approved");
  
  // Get current user's menu permissions from Redux store
  const currentloginDetails = useAppSelector(
    (state) => state.globalConfig.currentloginDetails
  );
  const currentUserMenuPermissions = currentloginDetails?.data?.menuPermissions || {};
  
  // Filter menu items to only show those the current user has permission for
  const allowedMenuItems = React.useMemo(() => {
    if (currentRole === "0") {
      // Admin can see all menus
      return MENU_ITEMS;
    } else if (currentRole === "2" || currentRole === "3") {
      // Store/Vendor users can only assign permissions for menus they have access to
      return MENU_ITEMS.filter((item) => {
        // Only show menu items where current user has permission (true)
        return currentUserMenuPermissions[item.key] === true;
      });
    }
    return [];
  }, [currentRole, currentUserMenuPermissions]);
  
  const { isOpen: isSubUserModalOpen, onOpen: onSubUserModalOpen, onOpenChange: onSubUserModalChange } = useDisclosure();
  const { isOpen: isPermissionModalOpen, onOpen: onPermissionModalOpen, onOpenChange: onPermissionModalChange } = useDisclosure();
  const { isOpen: isApprovalModalOpen, onOpen: onApprovalModalOpen, onOpenChange: onApprovalModalChange } = useDisclosure();

  // Admin: Store menu permissions
  const { data: storesData, isLoading: storesLoading } = useGetStoreQuery(
    undefined,
    { skip: currentRole !== "0", refetchOnMountOrArgChange: true }
  );

  // Admin: Get all vendors
  const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery(
    undefined,
    { skip: currentRole !== "0", refetchOnMountOrArgChange: true }
  );

  // Admin: Get all approved sub-users with filters
  const { data: approvedSubUsersData, isLoading: approvedLoading, refetch: refetchApproved } = useGetAllApprovedSubUsersQuery(
    { storeId: filterStoreId || undefined, vendorId: filterVendorId || undefined, status: filterStatus },
    { skip: currentRole !== "0", refetchOnMountOrArgChange: true }
  );

  // Admin: Get sub-users summary with filters
  const [summaryFilterStoreId, setSummaryFilterStoreId] = React.useState<string>("");
  const [summaryFilterVendorId, setSummaryFilterVendorId] = React.useState<string>("");
  
  const { data: summaryData, isLoading: summaryLoading, refetch: refetchSummary } = useGetSubUsersSummaryQuery(
    { storeId: summaryFilterStoreId || undefined, vendorId: summaryFilterVendorId || undefined },
    { skip: currentRole !== "0", refetchOnMountOrArgChange: true }
  );

  const { data: permissionsData, refetch: refetchPermissions } = 
    useGetStoreMenuPermissionsQuery(selectedStoreId, {
      skip: !selectedStoreId || currentRole !== "0",
      refetchOnMountOrArgChange: true,
    });

  // Vendor/Store: Sub-user management
  const { data: subUsersData, isLoading: subUsersLoading, refetch: refetchSubUsers } = useGetSubUsersQuery(undefined, {
    skip: currentRole === "0",
    refetchOnMountOrArgChange: true,
  });

  // Sub-user menu permissions
  const { data: subUserPermissionsData, refetch: refetchSubUserPermissions } = 
    useGetSubUserMenuPermissionsQuery(selectedSubUserId, {
      skip: !selectedSubUserId || currentRole === "0",
      refetchOnMountOrArgChange: true,
    });

  // Admin: Pending sub-user approvals
  const { data: pendingSubUsersData, isLoading: pendingLoading, refetch: refetchPending } = useGetPendingSubUsersQuery(undefined, {
    skip: currentRole !== "0",
    refetchOnMountOrArgChange: true,
  });

  const [updatePermission] = useUpdateStoreMenuPermissionMutation();
  const [updateSubUserPermission] = useUpdateSubUserMenuPermissionMutation();
  const [createSubUser] = useCreateSubUserMutation();
  const [updateSubUser] = useUpdateSubUserMutation();
  const [deleteSubUser] = useDeleteSubUserMutation();
  const [approveSubUser] = useApproveSubUserMutation();
  const [rejectSubUser] = useRejectSubUserMutation();

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const [permissions, setPermissions] = React.useState<Record<string, boolean>>({});
  const [subUserPermissions, setSubUserPermissions] = React.useState<Record<string, boolean>>({});

  // Initialize store permissions (Admin)
  React.useEffect(() => {
    if (permissionsData?.data && currentRole === "0") {
      const perms: Record<string, boolean> = {};
      MENU_ITEMS.forEach((item) => {
        perms[item.key] = permissionsData.data[item.key] || false;
      });
      setPermissions(perms);
    } else if (currentRole === "0") {
      const defaultPerms: Record<string, boolean> = {};
      MENU_ITEMS.forEach((item) => {
        defaultPerms[item.key] = true;
      });
      setPermissions(defaultPerms);
    }
  }, [permissionsData, currentRole]);

  // Initialize sub-user permissions (Vendor/Store)
  React.useEffect(() => {
    if (subUserPermissionsData?.data && currentRole !== "0") {
      const perms: Record<string, boolean> = {};
      MENU_ITEMS.forEach((item) => {
        perms[item.key] = subUserPermissionsData.data[item.key] || false;
      });
      setSubUserPermissions(perms);
    } else if (selectedSubUserId && currentRole !== "0") {
      const defaultPerms: Record<string, boolean> = {};
      MENU_ITEMS.forEach((item) => {
        defaultPerms[item.key] = true;
      });
      setSubUserPermissions(defaultPerms);
    }
  }, [subUserPermissionsData, selectedSubUserId, currentRole]);

  // Handle store menu permission toggle (Admin)
  const handlePermissionToggle = async (menuKey: string, enabled: boolean) => {
    if (!selectedStoreId || currentRole !== "0") return;

    const newPermissions = { ...permissions, [menuKey]: enabled };
    setPermissions(newPermissions);

    try {
      const result = await updatePermission({
        storeId: selectedStoreId,
        menuKey,
        enabled,
      });

      if (result?.data?.success) {
        refetchPermissions();
      } else {
        setPermissions(permissions);
        alert("Failed to update permission. Please try again.");
      }
    } catch (error) {
      setPermissions(permissions);
      alert("Failed to update permission. Please try again.");
    }
  };

  // Handle sub-user menu permission toggle (Vendor/Store)
  const handleSubUserPermissionToggle = async (menuKey: string, enabled: boolean) => {
    if (!selectedSubUserId || currentRole === "0") return;

    const newPermissions = { ...subUserPermissions, [menuKey]: enabled };
    setSubUserPermissions(newPermissions);

    try {
      const result = await updateSubUserPermission({
        subUserId: selectedSubUserId,
        menuKey,
        enabled,
      });

      if (result?.data?.success) {
        refetchSubUserPermissions();
      } else {
        setSubUserPermissions(subUserPermissions);
        alert("Failed to update permission. Please try again.");
      }
    } catch (error) {
      setSubUserPermissions(subUserPermissions);
      alert("Failed to update permission. Please try again.");
    }
  };

  // Create sub-user
  const onSubmitSubUser = async (data: any) => {
    try {
      const result = await createSubUser({
        ...data,
        vendorId: vendorId || null,
        storeId: storeId || null,
      });

      if (result?.data?.success) {
        alert("Sub-user created successfully. Waiting for admin approval.");
        reset();
        onSubUserModalChange();
        refetchSubUsers();
      } else {
        alert(result?.data?.message || "Failed to create sub-user. Please try again.");
      }
    } catch (error) {
      alert("Failed to create sub-user. Please try again.");
    }
  };

  // Delete sub-user
  const handleDeleteSubUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sub-user?")) return;

    try {
      const result = await deleteSubUser(id);
      if (result?.data?.success) {
        alert("Sub-user deleted successfully");
        refetchSubUsers();
      } else {
        alert("Failed to delete sub-user. Please try again.");
      }
    } catch (error) {
      alert("Failed to delete sub-user. Please try again.");
    }
  };

  // Approve sub-user (Admin)
  const handleApproveSubUser = async (id: string) => {
    try {
      const result = await approveSubUser({ id });
      if (result?.data?.success) {
        alert("Sub-user approved successfully");
        refetchPending();
        refetchSubUsers();
        refetchApproved();
        refetchSummary();
      } else {
        alert("Failed to approve sub-user. Please try again.");
      }
    } catch (error) {
      alert("Failed to approve sub-user. Please try again.");
    }
  };

  // Reject sub-user (Admin)
  const handleRejectSubUser = async (id: string, reason: string) => {
    try {
      const result = await rejectSubUser({ id, reason });
      if (result?.data?.success) {
        alert("Sub-user rejected");
        refetchPending();
        refetchApproved();
        refetchSummary();
      } else {
        alert("Failed to reject sub-user. Please try again.");
      }
    } catch (error) {
      alert("Failed to reject sub-user. Please try again.");
    }
  };

  // Refetch approved sub-users when filters change
  React.useEffect(() => {
    if (currentRole === "0") {
      refetchApproved();
    }
  }, [filterStoreId, filterVendorId, filterStatus, currentRole, refetchApproved]);

  // Refetch summary when summary filters change
  React.useEffect(() => {
    if (currentRole === "0") {
      refetchSummary();
    }
  }, [summaryFilterStoreId, summaryFilterVendorId, currentRole, refetchSummary]);

  // Open permission modal for sub-user
  const handleOpenPermissionModal = (subUserId: string) => {
    setSelectedSubUserId(subUserId);
    onPermissionModalOpen();
  };

  // Determine which tabs to show based on role
  const getTabs = () => {
    if (currentRole === "0") {
      return [
        { id: "store-permissions", label: "Store Menu Permissions" },
        { id: "pending-approvals", label: "Pending Approvals" },
        { id: "approved-sub-users", label: "Approved Sub-Users" },
        { id: "sub-users-summary", label: "Summary" },
      ];
    } else if (currentRole === "2" || currentRole === "3") {
      return [
        { id: "sub-users", label: "Sub-Users" },
        { id: "sub-user-permissions", label: "User Permissions" },
      ];
    }
    return [];
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-gray-600">
            {currentRole === "0"
              ? "Manage store menu permissions and approve sub-users"
              : "Manage sub-users and their menu access permissions"}
          </p>
        </CardHeader>
        <CardBody>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            aria-label="Settings tabs"
          >
            {/* Admin: Store Menu Permissions */}
            {currentRole === "0" && (
              <Tab key="store-permissions" title="Store Menu Permissions">
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex gap-4 items-end">
                    <Select
                      label="Select Store"
                      placeholder="Choose a store"
                      selectedKeys={selectedStoreId ? [selectedStoreId] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setSelectedStoreId(selected || "");
                      }}
                      className="max-w-xs"
                      isLoading={storesLoading}
                    >
                      {storesData?.data?.map((store: any) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.storename || store.name || `Store ${store.id}`}
                        </SelectItem>
                      ))}
                    </Select>
                    {selectedStoreId && (
                      <div className="flex gap-2">
                        <Button
                          color="success"
                          size="sm"
                          onPress={() => {
                            const newPerms: Record<string, boolean> = {};
                            MENU_ITEMS.forEach((item) => {
                              newPerms[item.key] = true;
                            });
                            setPermissions(newPerms);
                            MENU_ITEMS.forEach((item) => {
                              updatePermission({
                                storeId: selectedStoreId,
                                menuKey: item.key,
                                enabled: true,
                              });
                            });
                            setTimeout(() => refetchPermissions(), 500);
                          }}
                        >
                          Enable All
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          variant="flat"
                          onPress={() => {
                            const newPerms: Record<string, boolean> = {};
                            MENU_ITEMS.forEach((item) => {
                              newPerms[item.key] = false;
                            });
                            setPermissions(newPerms);
                            MENU_ITEMS.forEach((item) => {
                              updatePermission({
                                storeId: selectedStoreId,
                                menuKey: item.key,
                                enabled: false,
                              });
                            });
                            setTimeout(() => refetchPermissions(), 500);
                          }}
                        >
                          Disable All
                        </Button>
                      </div>
                    )}
                  </div>

                  {selectedStoreId ? (
                    <Table aria-label="Menu Permissions Table">
                      <TableHeader>
                        <TableColumn>Menu Item</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Action</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {MENU_ITEMS.map((item) => (
                          <TableRow key={item.key}>
                            <TableCell>
                              <span className="font-medium">{item.name}</span>
                            </TableCell>
                            <TableCell>
                              <Chip
                                color={permissions[item.key] ? "success" : "danger"}
                                variant="flat"
                              >
                                {permissions[item.key] ? "Enabled" : "Disabled"}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <Switch
                                isSelected={permissions[item.key] || false}
                                onValueChange={(enabled) =>
                                  handlePermissionToggle(item.key, enabled)
                                }
                                color="success"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Card>
                      <CardBody>
                        <p className="text-center text-gray-500">
                          Please select a store to manage menu permissions
                        </p>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </Tab>
            )}

            {/* Admin: Pending Approvals */}
            {currentRole === "0" && (
              <Tab key="pending-approvals" title="Pending Approvals">
                <div className="mt-4">
                  {pendingLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner size="lg" />
                    </div>
                  ) : (
                    <Table aria-label="Pending Sub-Users Table">
                      <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Email</TableColumn>
                        <TableColumn>Phone</TableColumn>
                        <TableColumn>Store/Vendor</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Actions</TableColumn>
                      </TableHeader>
                      <TableBody
                        items={pendingSubUsersData?.data || []}
                        emptyContent={
                          <p className="text-center text-gray-500 py-4">
                            No pending approvals
                          </p>
                        }
                      >
                        {(user: any) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>
                              {user.storeId ? `Store ${user.storeId}` : `Vendor ${user.vendorId}`}
                            </TableCell>
                            <TableCell>
                              <Chip color="warning" variant="flat">
                                Pending
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  color="success"
                                  size="sm"
                                  onPress={() => handleApproveSubUser(user.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  variant="flat"
                                  onPress={() => {
                                    const reason = prompt("Enter rejection reason:");
                                    if (reason) {
                                      handleRejectSubUser(user.id, reason);
                                    }
                                  }}
                                >
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </Tab>
            )}

            {/* Admin: Approved Sub-Users */}
            {currentRole === "0" && (
              <Tab key="approved-sub-users" title="Approved Sub-Users">
                <div className="mt-4">
                  <div className="flex flex-col gap-4 mb-4">
                    <h3 className="text-lg font-semibold">Approved Sub-Users List</h3>
                    <div className="flex gap-4 items-end flex-wrap">
                      <Select
                        label="Filter by Store"
                        placeholder="All Stores"
                        selectedKeys={filterStoreId ? [filterStoreId] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setFilterStoreId(selected || "");
                        }}
                        className="max-w-xs"
                        isLoading={storesLoading}
                      >
                        <SelectItem key="" value="">
                          All Stores
                        </SelectItem>
                        {storesData?.data?.map((store: any) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.storename || store.name || `Store ${store.id}`}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        label="Filter by Vendor"
                        placeholder="All Vendors"
                        selectedKeys={filterVendorId ? [filterVendorId] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setFilterVendorId(selected || "");
                        }}
                        className="max-w-xs"
                        isLoading={vendorsLoading}
                      >
                        <SelectItem key="" value="">
                          All Vendors
                        </SelectItem>
                        {vendorsData?.data?.map((vendor: any) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name || vendor.vendorname || `Vendor ${vendor.id}`}
                          </SelectItem>
                        ))}
                      </Select>
                      <Button
                        color="default"
                        variant="flat"
                        size="sm"
                        onPress={() => {
                          setFilterStoreId("");
                          setFilterVendorId("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {approvedLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner size="lg" />
                    </div>
                  ) : (
                    <Table aria-label="Approved Sub-Users Table">
                      <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Email</TableColumn>
                        <TableColumn>Phone</TableColumn>
                        <TableColumn>Store</TableColumn>
                        <TableColumn>Vendor</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Approved Date</TableColumn>
                      </TableHeader>
                      <TableBody
                        items={approvedSubUsersData?.data || []}
                        emptyContent={
                          <p className="text-center text-gray-500 py-4">
                            No approved sub-users found
                          </p>
                        }
                      >
                        {(user: any) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>
                              {user.storeId
                                ? storesData?.data?.find((s: any) => s.id === user.storeId)?.storename ||
                                  storesData?.data?.find((s: any) => s.id === user.storeId)?.name ||
                                  `Store ${user.storeId}`
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {user.vendorId
                                ? vendorsData?.data?.find((v: any) => v.id === user.vendorId)?.name ||
                                  vendorsData?.data?.find((v: any) => v.id === user.vendorId)?.vendorname ||
                                  `Vendor ${user.vendorId}`
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <Chip color="success" variant="flat">
                                Approved
                              </Chip>
                            </TableCell>
                            <TableCell>
                              {user.approvedAt
                                ? new Date(user.approvedAt).toLocaleDateString()
                                : "-"}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </Tab>
            )}

            {/* Admin: Sub-Users Summary */}
            {currentRole === "0" && (
              <Tab key="sub-users-summary" title="Summary">
                <div className="mt-4">
                  <div className="flex flex-col gap-4 mb-4">
                    <h3 className="text-lg font-semibold">Sub-Users Summary</h3>
                    <div className="flex gap-4 items-end flex-wrap">
                      <Select
                        label="Filter by Store"
                        placeholder="All Stores"
                        selectedKeys={summaryFilterStoreId ? [summaryFilterStoreId] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setSummaryFilterStoreId(selected || "");
                        }}
                        className="max-w-xs"
                        isLoading={storesLoading}
                      >
                        <SelectItem key="" value="">
                          All Stores
                        </SelectItem>
                        {storesData?.data?.map((store: any) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.storename || store.name || `Store ${store.id}`}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        label="Filter by Vendor"
                        placeholder="All Vendors"
                        selectedKeys={summaryFilterVendorId ? [summaryFilterVendorId] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setSummaryFilterVendorId(selected || "");
                        }}
                        className="max-w-xs"
                        isLoading={vendorsLoading}
                      >
                        <SelectItem key="" value="">
                          All Vendors
                        </SelectItem>
                        {vendorsData?.data?.map((vendor: any) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name || vendor.vendorname || `Vendor ${vendor.id}`}
                          </SelectItem>
                        ))}
                      </Select>
                      <Button
                        color="default"
                        variant="flat"
                        size="sm"
                        onPress={() => {
                          setSummaryFilterStoreId("");
                          setSummaryFilterVendorId("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                  
                  {summaryLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner size="lg" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Total Sub-Users */}
                      <Card className="border-l-4 border-l-indigo-500">
                        <CardBody className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Total Sub-Users</p>
                              <p className="text-2xl font-bold text-indigo-600">
                                {summaryData?.data?.total || 0}
                              </p>
                            </div>
                            <Chip color="primary" variant="flat">👥</Chip>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Approved */}
                      <Card className="border-l-4 border-l-green-500">
                        <CardBody className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Approved</p>
                              <p className="text-2xl font-bold text-green-600">
                                {summaryData?.data?.approved || 0}
                              </p>
                            </div>
                            <Chip color="success" variant="flat">✓</Chip>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Pending */}
                      <Card className="border-l-4 border-l-yellow-500">
                        <CardBody className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Pending</p>
                              <p className="text-2xl font-bold text-yellow-600">
                                {summaryData?.data?.pending || 0}
                              </p>
                            </div>
                            <Chip color="warning" variant="flat">⏳</Chip>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Rejected */}
                      <Card className="border-l-4 border-l-red-500">
                        <CardBody className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Rejected</p>
                              <p className="text-2xl font-bold text-red-600">
                                {summaryData?.data?.rejected || 0}
                              </p>
                            </div>
                            <Chip color="danger" variant="flat">✗</Chip>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}

                  {/* Recent Activity */}
                  {summaryData?.data?.recent && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold mb-3">Recent Activity</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Recently Created</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  {summaryData?.data?.recent?.created || 0}
                                </p>
                              </div>
                              <Chip color="primary" variant="flat">🆕</Chip>
                            </div>
                          </CardBody>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Recently Approved</p>
                                <p className="text-2xl font-bold text-green-600">
                                  {summaryData?.data?.recent?.approved || 0}
                                </p>
                              </div>
                              <Chip color="success" variant="flat">✅</Chip>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Summary Statistics */}
                  <div className="mt-6">
                    <Card>
                      <CardHeader>
                        <h4 className="text-md font-semibold">Summary Statistics</h4>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Sub-Users:</span>
                            <span className="font-semibold">{summaryData?.data?.total || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Approved:</span>
                            <Chip color="success" variant="flat" size="sm">
                              {summaryData?.data?.approved || 0}
                            </Chip>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Pending Approval:</span>
                            <Chip color="warning" variant="flat" size="sm">
                              {summaryData?.data?.pending || 0}
                            </Chip>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Rejected:</span>
                            <Chip color="danger" variant="flat" size="sm">
                              {summaryData?.data?.rejected || 0}
                            </Chip>
                          </div>
                          {summaryData?.data?.recent && (
                            <>
                              <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Recently Created:</span>
                                  <span className="font-semibold text-blue-600">
                                    {summaryData?.data?.recent?.created || 0}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Recently Approved:</span>
                                <span className="font-semibold text-green-600">
                                  {summaryData?.data?.recent?.approved || 0}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Tab>
            )}

            {/* Vendor/Store: Sub-Users Management */}
            {(currentRole === "2" || currentRole === "3") && (
              <Tab key="sub-users" title="Sub-Users">
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Manage Sub-Users</h3>
                    <Button color="primary" onPress={onSubUserModalOpen}>
                      + Add Sub-User
                    </Button>
                  </div>

                  {subUsersLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner size="lg" />
                    </div>
                  ) : (
                    <Table aria-label="Sub-Users Table">
                      <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Email</TableColumn>
                        <TableColumn>Phone</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Actions</TableColumn>
                      </TableHeader>
                      <TableBody
                        items={subUsersData?.data || []}
                        emptyContent={
                          <p className="text-center text-gray-500 py-4">
                            No sub-users found. Create one to get started.
                          </p>
                        }
                      >
                        {(user: any) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>
                              <Chip
                                color={
                                  user.status === "approved"
                                    ? "success"
                                    : user.status === "pending"
                                    ? "warning"
                                    : "danger"
                                }
                                variant="flat"
                              >
                                {user.status || "Pending"}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="flat"
                                  onPress={() => handleOpenPermissionModal(user.id)}
                                >
                                  Permissions
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  variant="flat"
                                  onPress={() => handleDeleteSubUser(user.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </Tab>
            )}

            {/* Vendor/Store: Sub-User Permissions */}
            {(currentRole === "2" || currentRole === "3") && (
              <Tab key="sub-user-permissions" title="User Permissions">
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex gap-4 items-end">
                    <Select
                      label="Select Sub-User"
                      placeholder="Choose a sub-user"
                      selectedKeys={selectedSubUserId ? [selectedSubUserId] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setSelectedSubUserId(selected || "");
                      }}
                      className="max-w-xs"
                    >
                      {subUsersData?.data
                        ?.filter((user: any) => user.status === "approved")
                        ?.map((user: any) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} ({user.email})
                          </SelectItem>
                        ))}
                    </Select>
                  </div>

                  {selectedSubUserId ? (
                    <Table aria-label="Sub-User Menu Permissions Table">
                      <TableHeader>
                        <TableColumn>Menu Item</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Action</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {allowedMenuItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3}>
                              <p className="text-center text-gray-500 py-4">
                                No menu permissions available. You can only assign permissions for menus you have access to.
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          allowedMenuItems.map((item) => (
                            <TableRow key={item.key}>
                              <TableCell>
                                <span className="font-medium">{item.name}</span>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  color={subUserPermissions[item.key] ? "success" : "danger"}
                                  variant="flat"
                                >
                                  {subUserPermissions[item.key] ? "Enabled" : "Disabled"}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <Switch
                                  isSelected={subUserPermissions[item.key] || false}
                                  onValueChange={(enabled) =>
                                    handleSubUserPermissionToggle(item.key, enabled)
                                  }
                                  color="success"
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  ) : (
                    <Card>
                      <CardBody>
                        <p className="text-center text-gray-500">
                          Please select a sub-user to manage menu permissions
                        </p>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </Tab>
            )}
          </Tabs>
        </CardBody>
      </Card>

      {/* Create Sub-User Modal */}
      <Modal isOpen={isSubUserModalOpen} onOpenChange={onSubUserModalChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmitSubUser)}>
              <ModalHeader>Create New Sub-User</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: "First name is required" }}
                    render={({ field, fieldState }) => (
                      <Input
                        label="First Name"
                        placeholder="Enter first name"
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                      />
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: "Last name is required" }}
                    render={({ field, fieldState }) => (
                      <Input
                        label="Last Name"
                        placeholder="Enter last name"
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                      />
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <Input
                        label="Email"
                        type="email"
                        placeholder="Enter email"
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                      />
                    )}
                  />
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: "Phone is required" }}
                    render={({ field, fieldState }) => (
                      <Input
                        label="Phone"
                        placeholder="Enter phone number"
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                      />
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <Input
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                        className="col-span-2"
                      />
                    )}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Note: Sub-user will be created and sent for admin approval. They can only access after approval.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Create Sub-User
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Sub-User Permissions Modal */}
      <Modal isOpen={isPermissionModalOpen} onOpenChange={onPermissionModalChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Manage Menu Permissions</ModalHeader>
              <ModalBody>
                {allowedMenuItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No menu permissions available. You can only assign permissions for menus you have access to.
                    </p>
                  </div>
                ) : (
                  <Table aria-label="Sub-User Menu Permissions Table">
                    <TableHeader>
                      <TableColumn>Menu Item</TableColumn>
                      <TableColumn>Status</TableColumn>
                      <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {allowedMenuItems.map((item) => (
                        <TableRow key={item.key}>
                          <TableCell>
                            <span className="font-medium">{item.name}</span>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={subUserPermissions[item.key] ? "success" : "danger"}
                              variant="flat"
                            >
                              {subUserPermissions[item.key] ? "Enabled" : "Disabled"}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Switch
                              isSelected={subUserPermissions[item.key] || false}
                              onValueChange={(enabled) =>
                                handleSubUserPermissionToggle(item.key, enabled)
                              }
                              color="success"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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

export default Settings;
