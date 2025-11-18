import { useGetProductsQuery } from "./Service.mjs";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  User,
} from "@nextui-org/react";
import React from "react";
import { TableList } from "../../Components/Table/TableList";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { useGetVendorsProductByIdQuery } from "../VendorProducts/Service.mjs";
import { useGetStoresProductByIDQuery, useGetStoresByIDQuery } from "../Store/Service.mjs";
import { infoData } from "../../configData";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import "jspdf-autotable";
const ProductsList = () => {
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const { data, error, refetch } = useGetProductsQuery(undefined, { skip: !!vendorId || !!storeId, refetchOnMountOrArgChange: true });

  const { data: storeData, error: storeError, refetch: storeRefetch } = useGetStoresByIDQuery(
    Number(storeId), { skip: !storeId , refetchOnMountOrArgChange: true}
  );

  const nativegate = useNavigate();
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  
  const {
    data: vendorProducts,
    error: vendorError,
    refetch: vendorRefetch,
  } = useGetVendorsProductByIdQuery(Number(vendorId), { skip: !vendorId, refetchOnMountOrArgChange: true });
  const {
    data: storeProducts,
    error: storeProductsError,
    refetch: storeProductsRefetch,
  } = useGetStoresProductByIDQuery(Number(storeId), { skip:!storeId, refetchOnMountOrArgChange: true });
  const currentRole = getCookie("role");

  const defaultCloumns = [
    "id",
    "name",
    "actions",
    "total",
    "sortDesc",
    "photo",
    "barcode",
    "status",
    "createdType",
  ];
  const byuserProduct = [
    "total",
    "unitSize",
    "product",
    "photo",
    "barcode",
    "actions",
    "status",
  ];
  const byuserCloumn = [
    { name: "Price", id: "total", sortable: true },
    { name: "Unit Size", id: "unitSize", sortable: true },
    { name: "Products", id: "product", sortable: true },
    { name: "Image", id: "photo", sortable: true },
    { name: "Barcode", id: "barcode", sortable: false },
    { name: "Status", id: "status", sortable: false },
    { name: "Action", id: "actions", sortable: false },
  ];
  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "name", id: "name", sortable: true },
    { name: "total", id: "total", sortable: true },
    { name: "sortDesc", id: "sortDesc", sortable: true },
    { name: "image", id: "photo", sortable: true },
    { name: "Barcode", id: "barcode", sortable: false },
    { name: "Status", id: "status" },
    { name: "Created", id: "createdType" },
    ...(currentRole !== "1" ? [{ name: "Actions", id: "actions" }] : []),
  ];

  // React.useEffect(() => {
  //   if (storeId || vendorId) {
  //     refetch();
  //     vendorRefetch();
  //     stroeRefetch();
  //   }
  // }, [vendorId, storeId]);

  // Barcode component
  const BarcodeDisplay = React.memo(({ productId }: { productId: string | number }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const productIdStr = String(productId);

    React.useEffect(() => {
      if (canvasRef.current) {
        try {
          JsBarcode(canvasRef.current, productIdStr, {
            format: "CODE128",
            width: 2,
            height: 50,
            displayValue: true,
            fontSize: 12,
          });
        } catch (error) {
          console.error("Error generating barcode:", error);
        }
      }
    }, [productIdStr]);

    return (
      <div className="flex justify-center">
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      </div>
    );
  });

  const renderCell = React.useCallback((data, columnKey) => {
    console.log(data, "asdfa7s09df7")
    switch (columnKey) {
      case "product":
        return <p>{data?.product?.name ? data?.product?.name :  data?.name}</p>;
      case "barcode":
        const productId = data?.product?.id || data?.id || data?.productId;
        if (!productId) return <span>-</span>;
        return <BarcodeDisplay productId={productId} />;
      case "storename":
        return (
          <User
            avatarProps={{ radius: "lg", src: data.avatar }}
            description={data.email}
            name={data?.[columnKey]}
          >
            {data.email}
          </User>
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
                  onClick={() => nativegate(`/AddProducts/${data.product?.id ? data.product?.id : data?.id}`)}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  onClick={() => nativegate(`/AddProducts/${data.product?.id ? data.product?.id : data?.id}`)}
                >
                  Edit
                </DropdownItem>
                {/* <DropdownItem>Delete</DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "photo":
        return (
          <div className="relative flex justify-center items-center gap-2">
            {
              <Image
                src={`${data?.product?.photo ? data?.product?.photo : data?.photo}`}
                width={50}
                height={50}
              />
            }
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={
              data?.product?.status === "1" || data?.status === "1"
                ? "success"
                : "danger"
            }
            size="lg"
            variant="flat"
          >
            {data?.product?.status === "1" || data?.status === "1"
              ? "Active"
              : "In Active"}
          </Chip>
        );
      default:
        return data?.product?.[columnKey]
          ? data?.product?.[columnKey]
          : data?.[columnKey];
    }
  }, []);

  // Download PDF with product labels (like the image)
  const handleDownloadPDF = React.useCallback(async () => {
    try {
      // Dynamic import for jspdf
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF();
      const allProducts = currentRole === "0"
        ? data?.["data"] || []
        : currentRole === "2"
          ? vendorProducts?.data || []
          : storeProducts?.data || [];

      let products = [];
      
      // Filter products based on selection
      if (selectedKeys === "all") {
        products = allProducts;
      } else if (selectedKeys.size > 0) {
        const selectedIds = Array.from(selectedKeys);
        products = allProducts.filter((item: any) => {
          // Try to match any possible ID field
          const id = String(item?.product?.id || item?.id || item?.productId);
          // Also check store product ID if available
          const storeProductId = String(item.id);
          return selectedIds.includes(id) || selectedIds.includes(storeProductId);
        });
      } else {
        alert("Please select at least one product to download barcodes.");
        return;
      }

      if (products.length === 0) {
        alert("No products selected found.");
        return;
      }

      // Label dimensions (in mm)
      const labelWidth = 90; // mm
      const labelHeight = 50; // mm
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10;
      const labelsPerRow = 2;
      const labelsPerColumn = 5;
      const spacing = 5; // spacing between labels
      
      let labelIndex = 0;

      for (let i = 0; i < products.length; i++) {
        const item = products[i];
        const product = item?.product || item;
        const productId = product?.id || item?.id || item?.productId || "";
        const productName = product?.name || item?.name || `Product ${i + 1}`;
        const productPrice = product?.total || item?.total || product?.price || 0;
        const productDiscount = item?.discount || product?.discount || 0;
        const productMRP = product?.price || item?.price || 0;
        const design = product?.slug || item?.slug || "";
        const description = product?.sortDesc || item?.sortDesc || "";

        // Calculate position for this label
        const row = Math.floor(labelIndex / labelsPerRow) % labelsPerColumn;
        const col = labelIndex % labelsPerRow;
        
        // Add new page if needed
        if (labelIndex > 0 && labelIndex % (labelsPerRow * labelsPerColumn) === 0) {
          doc.addPage();
        }

        const x = margin + (col * (labelWidth + spacing));
        const y = margin + (row * (labelHeight + spacing));

        // Draw label border
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(x, y, labelWidth, labelHeight);

        // Generate barcode
        const canvas = document.createElement("canvas");
        let barcodeDataUrl = "";
        try {
          JsBarcode(canvas, String(productId), {
            format: "CODE128",
            width: 1.5,
            height: 30,
            displayValue: true,
            fontSize: 8,
            margin: 0,
          });
          barcodeDataUrl = canvas.toDataURL("image/png");
        } catch (error) {
          console.error("Error generating barcode:", error);
        }

        // Product information (left side)
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        
        // Item name
        const itemName = `Item: ${productName}`;
        const maxItemWidth = labelWidth - 50; // Leave space for barcode
        let itemText = itemName;
        if (doc.getTextWidth(itemText) > maxItemWidth) {
          // Truncate if too long
          while (doc.getTextWidth(itemText + "...") > maxItemWidth && itemText.length > 0) {
            itemText = itemText.substring(0, itemText.length - 1);
          }
          itemText += "...";
        }
        doc.text(itemText, x + 2, y + 5);
        
        // Design/SKU
        if (design) {
          doc.setFontSize(8);
          doc.text(`Design: ${design}`, x + 2, y + 10);
        }
        
        // Description
        if (description) {
          doc.setFontSize(7);
          const descText = description.length > 35 ? description.substring(0, 35) + "..." : description;
          doc.text(`Desc: ${descText}`, x + 2, y + 15);
        }

        // Pricing information
        doc.setFontSize(8);
        const priceY = y + 22;
        
        if (productDiscount > 0 || productMRP > productPrice) {
          // MRP (crossed out)
          doc.setTextColor(150, 150, 150);
          doc.setFont("helvetica", "normal");
          const mrpText = `MRP: ${Math.round(productMRP).toLocaleString('en-IN')}/-`;
          const mrpWidth = doc.getTextWidth(mrpText);
          doc.text(mrpText, x + 2, priceY);
          // Draw line through MRP
          doc.setDrawColor(150, 150, 150);
          doc.setLineWidth(0.3);
          doc.line(x + 2, priceY - 1.5, x + 2 + mrpWidth, priceY - 1.5);
        }

        // Offer Price (bold)
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("Offer Price", x + 2, priceY + 6);
        doc.setFontSize(10);
        const offerPriceText = `₹${Math.round(productPrice).toLocaleString('en-IN')}/-`;
        doc.text(offerPriceText, x + 2, priceY + 12);

        // Barcode (right side)
        if (barcodeDataUrl) {
          const barcodeX = x + labelWidth - 45;
          const barcodeY = y + 5;
          doc.addImage(barcodeDataUrl, "PNG", barcodeX, barcodeY, 40, 20);
          
          // Product ID below barcode (spaced format)
          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          const idText = String(productId).split('').join(' ');
          const idTextWidth = doc.getTextWidth(idText);
          doc.text(idText, barcodeX + 20 - (idTextWidth / 2), barcodeY + 25);
        }

        // Store Name at bottom
        const storeName = storeData?.data?.storename;
        if (storeName) {
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          // Center the store name at the bottom
          const storeNameWidth = doc.getTextWidth(storeName);
          // doc.text(storeName, x + (labelWidth - storeNameWidth) / 2, y + labelHeight - 3);
          doc.text(storeName, x + 2, y + labelHeight - 3);
        }

        labelIndex++;
      }

      // Save PDF
      doc.save(`product-labels-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  }, [data, vendorProducts, storeProducts, currentRole, storeData, selectedKeys]);

  return (
    <div className="mx-2">
      <div className="flex justify-between items-center gap-2 my-3">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex gap-2">
          <Button
            color="success"
            onClick={handleDownloadPDF}
            size="md"
            variant="flat"
            isDisabled={selectedKeys !== "all" && selectedKeys.size === 0}
          >
            {selectedKeys === "all" || selectedKeys.size > 0 
              ? `Download PDF (${selectedKeys === "all" ? "All" : selectedKeys.size})`
              : "Select Products to Download"}
          </Button>
          <Button
            color="primary"
            onClick={() => nativegate("/AddProducts")}
            size="md"
            variant="flat"
          >
            Add Products
          </Button>
        </div>
      </div>
      {data || vendorProducts?.data || storeProducts?.data  ? (
        <TableList
          defaultCloumns={currentRole !== "1" ? byuserProduct : defaultCloumns}
          renderCell={renderCell}
          columns={currentRole !== "1" ? byuserCloumn : columns}
          tableItems={
            currentRole === "0"
              ? data?.["data"]
              : currentRole === "2"
                ? vendorProducts?.data
                : storeProducts?.data
          }
          isStatusFilter={false}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
      ) : <p>No Products</p>}
    </div>
  );
};

export default ProductsList;
