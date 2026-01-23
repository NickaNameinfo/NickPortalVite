import React from "react";
import {
  Select,
  SelectItem,
  Avatar,
  Chip,
} from "@nextui-org/react";
import { useGetVendorsQuery } from "../../views/vendors/Service.mjs";
import { infoData } from "../../configData";

interface VendorSelectorProps {
  value?: number | string;
  onChange?: (value: number | string) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "flat" | "bordered" | "faded" | "underlined";
  isRequired?: boolean;
  errorMessage?: string;
  selectedVendor?: any;
  onVendorSelect?: (vendor: any) => void;
}

export const VendorSelector: React.FC<VendorSelectorProps> = ({
  value,
  onChange,
  label = "Select Vendor",
  size = "md",
  variant = "faded",
  isRequired = false,
  errorMessage,
  selectedVendor,
  onVendorSelect,
}) => {
  const { data: vendorsData, isLoading } = useGetVendorsQuery();

  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0];
    if (selectedKey && selectedKey !== "0") {
      const vendor = vendorsData?.data?.find((v: any) => v.id === Number(selectedKey));
      if (onChange) {
        onChange(Number(selectedKey));
      }
      if (onVendorSelect && vendor) {
        onVendorSelect(vendor);
      }
    } else {
      if (onChange) {
        onChange(0);
      }
      if (onVendorSelect) {
        onVendorSelect(null);
      }
    }
  };

  const selectedVendorData = selectedVendor || 
    (value ? vendorsData?.data?.find((v: any) => v.id === Number(value)) : null);

  return (
    <div className="w-full">
      <Select
        label={label}
        placeholder="Choose a vendor"
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
            const vendor = vendorsData?.data?.find((v: any) => v.id === Number(item.key));
            return vendor ? (
              <div key={item.key} className="flex items-center gap-2">
                <Avatar
                  src={`${infoData.baseApi}/${vendor.vendorImage}`}
                  size="sm"
                  name={vendor.storename}
                />
                <span>{vendor.storename}</span>
              </div>
            ) : null;
          });
        }}
      >
        <SelectItem key="0" textValue="Select Vendor">
          <div className="flex items-center gap-2">
            <span>Select Vendor</span>
          </div>
        </SelectItem>
        {vendorsData?.data?.map((vendor: any) => (
          <SelectItem key={vendor.id} textValue={vendor.storename}>
            <div className="flex items-center gap-2">
              <Avatar
                src={`${infoData.baseApi}/${vendor.vendorImage}`}
                size="sm"
                name={vendor.storename}
              />
              <div className="flex flex-col">
                <span className="text-small">{vendor.storename}</span>
                <span className="text-tiny text-default-400">{vendor.email}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </Select>
      
      {selectedVendorData && (
        <div className="mt-2 p-2 bg-default-100 rounded-lg">
          <div className="flex items-center gap-2">
            <Avatar
              src={`${infoData.baseApi}/${selectedVendorData.vendorImage}`}
              size="sm"
              name={selectedVendorData.storename}
            />
            <div className="flex-1">
              <p className="text-small font-semibold">{selectedVendorData.storename}</p>
              <p className="text-tiny text-default-500">{selectedVendorData.email}</p>
              <p className="text-tiny text-default-500">{selectedVendorData.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorSelector;

