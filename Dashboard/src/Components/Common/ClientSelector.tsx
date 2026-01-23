import React from "react";
import {
  Select,
  SelectItem,
  Avatar,
} from "@nextui-org/react";
import { useGetClientsQuery } from "../../views/Inventory/Service.mjs";

interface ClientSelectorProps {
  value?: number | string;
  onChange?: (value: number | string) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "flat" | "bordered" | "faded" | "underlined";
  isRequired?: boolean;
  errorMessage?: string;
  selectedClient?: any;
  onClientSelect?: (client: any) => void;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  value,
  onChange,
  label = "Select Client",
  size = "md",
  variant = "faded",
  isRequired = false,
  errorMessage,
  selectedClient,
  onClientSelect,
}) => {
  // Use new clients API that filters by current store/vendor
  const { data: clientsData, isLoading } = useGetClientsQuery({});

  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0];
    if (selectedKey && selectedKey !== "0") {
      const client = clientsData?.data?.find((c: any) => c.id === Number(selectedKey));
      if (onChange) {
        onChange(Number(selectedKey));
      }
      if (onClientSelect && client) {
        onClientSelect(client);
      }
    } else {
      if (onChange) {
        onChange(0);
      }
      if (onClientSelect) {
        onClientSelect(null);
      }
    }
  };

  const selectedClientData = selectedClient || 
    (value ? clientsData?.data?.find((c: any) => c.id === Number(value)) : null);

  return (
    <div className="w-full">
      <Select
        label={label}
        placeholder="Choose a client"
        variant={variant}
        size={size}
        selectedKeys={value ? new Set([String(value)]) : new Set(["0"])}
        onSelectionChange={handleSelectionChange}
        isLoading={isLoading}
        isRequired={isRequired}
        errorMessage={errorMessage}
        classNames={{
          label: "group-data-[filled=true]:-translate-y-3",
          trigger: [
            "bg-transparent",
            "border-1",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:bg-transparent",
          ],
        }}
        listboxProps={{
          itemClasses: {
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
            ],
          },
        }}
        renderValue={(items) => {
          return items.map((item) => {
            const client = clientsData?.data?.find((c: any) => c.id === Number(item.key));
            return client ? (
              <div key={item.key} className="flex items-center gap-2">
                <Avatar
                  name={client.firstName || client.email}
                  size="sm"
                />
                <span>{client.firstName || client.email}</span>
              </div>
            ) : null;
          });
        }}
      >
        <SelectItem key="0" textValue="Select Client">
          <div className="flex items-center gap-2">
            <span>Select Client</span>
          </div>
        </SelectItem>
        {clientsData?.data?.map((client: any) => (
          <SelectItem key={client.id} textValue={client.firstName || client.email}>
            <div className="flex items-center gap-2">
              <Avatar
                name={client.firstName || client.email}
                size="sm"
              />
              <div className="flex flex-col">
                <span className="text-small">{client.firstName || client.email}</span>
                <span className="text-tiny text-default-400">{client.email}</span>
                {client.phone && (
                  <span className="text-tiny text-default-400">{client.phone}</span>
                )}
              </div>
            </div>
          </SelectItem>
        ))}
      </Select>
      
      {selectedClientData && (
        <div className="mt-2 p-2 bg-default-100 rounded-lg">
          <div className="flex items-center gap-2">
            <Avatar
              name={selectedClientData.firstName || selectedClientData.email}
              size="sm"
            />
            <div className="flex-1">
              <p className="text-small font-semibold">
                {selectedClientData.firstName || selectedClientData.email}
              </p>
              <p className="text-tiny text-default-500">{selectedClientData.email}</p>
              {selectedClientData.phone && (
                <p className="text-tiny text-default-500">{selectedClientData.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;

