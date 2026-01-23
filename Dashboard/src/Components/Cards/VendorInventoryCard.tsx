import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Chip,
  Button,
} from "@nextui-org/react";
import { infoData } from "../../configData";
import { useNavigate } from "react-router-dom";

interface VendorInventoryCardProps {
  vendor: {
    id: number;
    storename: string;
    vendorImage?: string;
    email?: string;
    phone?: string;
  };
  inboundTotal?: number;
  outboundTotal?: number;
  currentStock?: number;
  lowStockAlerts?: number;
  onClick?: () => void;
}

export const VendorInventoryCard: React.FC<VendorInventoryCardProps> = ({
  vendor,
  inboundTotal = 0,
  outboundTotal = 0,
  currentStock = 0,
  lowStockAlerts = 0,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/Vendors/Products/Details/${vendor.id}`);
    }
  };

  return (
    <Card
      isPressable
      onPress={handleClick}
      className="hover:shadow-lg transition-shadow"
    >
      <CardHeader className="flex gap-3">
        <Avatar
          src={`${infoData.baseApi}/${vendor.vendorImage || ""}`}
          name={vendor.storename}
          size="lg"
        />
        <div className="flex flex-col flex-1">
          <p className="text-md font-semibold">{vendor.storename}</p>
          {vendor.email && (
            <p className="text-small text-default-500">{vendor.email}</p>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <p className="text-tiny text-default-500">Inbound</p>
            <p className="text-lg font-bold text-success">{inboundTotal}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-tiny text-default-500">Outbound</p>
            <p className="text-lg font-bold text-danger">{outboundTotal}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-tiny text-default-500">Current Stock</p>
            <p className="text-lg font-bold">{currentStock}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-tiny text-default-500">Low Stock</p>
            <Chip
              size="sm"
              color={lowStockAlerts > 0 ? "danger" : "success"}
              variant="flat"
            >
              {lowStockAlerts}
            </Chip>
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <Button
          size="sm"
          variant="flat"
          color="primary"
          onPress={handleClick}
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VendorInventoryCard;

