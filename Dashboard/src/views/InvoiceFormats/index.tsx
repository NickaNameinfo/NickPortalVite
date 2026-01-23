import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Chip,
  Tabs,
  Tab,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import {
  useGetAllInvoiceFormatsQuery,
  useGetInvoiceFormatByIdQuery,
  useCreateInvoiceFormatMutation,
  useUpdateInvoiceFormatMutation,
  useDeleteInvoiceFormatMutation,
  useGetStoreInvoiceFormatQuery,
  useAssignStoreInvoiceFormatMutation,
  useGetVendorInvoiceFormatQuery,
  useAssignVendorInvoiceFormatMutation,
  useGetAllInvoiceFormatAssignmentsQuery,
} from "./Service.mjs";
import { useGetStoreQuery, useGetStoresProductByIDQuery } from "../Store/Service.mjs";
import { useGetVendorsQuery } from "../vendors/Service.mjs";
import { useGetCategoriesQuery } from "../Categories/Service.mjs";
import { useGetVendorsProductByIdQuery } from "../VendorProducts/Service.mjs";
import { useGetProductsQuery, useAddProductMutation, useUpdateProductMutation } from "../Products/Service.mjs";
import CategoryModal from "../../Components/CategoryModal";

const InvoiceFormats = () => {
  const currentRole = getCookie("role");
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const [activeTab, setActiveTab] = React.useState<string>("formats");
  const [selectedFormatId, setSelectedFormatId] = React.useState<string>("");
  const [selectedStoreId, setSelectedStoreId] = React.useState<string>("");
  const [selectedVendorId, setSelectedVendorId] = React.useState<string>("");
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isAssignModalOpen, onOpen: onAssignModalOpen, onOpenChange: onAssignModalChange } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onOpenChange: onViewModalChange } = useDisclosure();
  const { isOpen: isAssignedListModalOpen, onOpen: onAssignedListModalOpen, onOpenChange: onAssignedListModalChange } = useDisclosure();
  const { isOpen: isCategoryModalOpen, onOpen: onCategoryModalOpen, onOpenChange: onCategoryModalChange } = useDisclosure();
  const { isOpen: isProductModalOpen, onOpen: onProductModalOpen, onOpenChange: onProductModalChange } = useDisclosure();

  const [viewingFormat, setViewingFormat] = React.useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isProductEditMode, setIsProductEditMode] = React.useState<boolean>(false);

  // Fetch categories for display
  const { data: categoryData } = useGetCategoriesQuery();

  // Fetch products based on role
  const { data: allProductsData, isLoading: productsLoading, refetch: refetchProducts } = useGetProductsQuery(
    undefined,
    { skip: currentRole !== "0", refetchOnMountOrArgChange: true }
  );

  const { data: storeProductsData, isLoading: storeProductsLoading, refetch: refetchStoreProducts } = useGetStoresProductByIDQuery(
    Number(storeId),
    { skip: !storeId || currentRole !== "3", refetchOnMountOrArgChange: true }
  );

  const { data: vendorProductsData, isLoading: vendorProductsLoading, refetch: refetchVendorProducts } = useGetVendorsProductByIdQuery(
    Number(vendorId),
    { skip: !vendorId || currentRole !== "2", refetchOnMountOrArgChange: true }
  );

  // Get products based on role
  const products = React.useMemo(() => {
    if (currentRole === "0") return allProductsData?.data || [];
    if (currentRole === "3" && storeId) return storeProductsData?.data || [];
    if (currentRole === "2" && vendorId) return vendorProductsData?.data || [];
    return [];
  }, [currentRole, allProductsData, storeProductsData, vendorProductsData, storeId, vendorId]);

  const isLoadingProducts = productsLoading || storeProductsLoading || vendorProductsLoading;

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // Product form
  const { control: productControl, handleSubmit: handleProductSubmit, reset: resetProduct, setValue: setProductValue, watch: watchProduct } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
    },
  });

  // Fetch data
  const { data: formatsData, isLoading: formatsLoading, refetch: refetchFormats } = useGetAllInvoiceFormatsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const { data: storesData, isLoading: storesLoading } = useGetStoreQuery(undefined, {
    skip: currentRole !== "0",
    refetchOnMountOrArgChange: true,
  });

  const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery(undefined, {
    skip: currentRole !== "0",
    refetchOnMountOrArgChange: true,
  });

  const { data: storeFormatData } = useGetStoreInvoiceFormatQuery(selectedStoreId, {
    skip: !selectedStoreId || currentRole !== "0",
    refetchOnMountOrArgChange: true,
  });

  const { data: vendorFormatData } = useGetVendorInvoiceFormatQuery(selectedVendorId, {
    skip: !selectedVendorId || currentRole !== "0",
    refetchOnMountOrArgChange: true,
  });

  // Get all assignments (Admin only)
  const { data: assignmentsData, isLoading: assignmentsLoading, refetch: refetchAssignments } = useGetAllInvoiceFormatAssignmentsQuery(
    undefined,
    { skip: currentRole !== "0", refetchOnMountOrArgChange: true }
  );

  // Create a map of store/vendor IDs to their assigned formats for quick lookup
  const assignmentsMap = React.useMemo(() => {
    const map: Record<string, { formatId: number; formatName: string; isDefault: boolean }> = {};

    if (assignmentsData?.data?.stores) {
      assignmentsData.data.stores.forEach((item: any) => {
        if (item.storeId && item.format) {
          map[`store-${item.storeId}`] = {
            formatId: item.format.id,
            formatName: item.format.name,
            isDefault: item.format.isDefault || false,
          };
        }
      });
    }

    if (assignmentsData?.data?.vendors) {
      assignmentsData.data.vendors.forEach((item: any) => {
        if (item.vendorId && item.format) {
          map[`vendor-${item.vendorId}`] = {
            formatId: item.format.id,
            formatName: item.format.name,
            isDefault: item.format.isDefault || false,
          };
        }
      });
    }

    return map;
  }, [assignmentsData]);

  // Get format details for viewing
  const { data: formatDetailsData, isLoading: formatDetailsLoading } = useGetInvoiceFormatByIdQuery(
    viewingFormat?.id || "",
    { skip: !viewingFormat?.id, refetchOnMountOrArgChange: true }
  );

  const [createFormat] = useCreateInvoiceFormatMutation();
  const [updateFormat] = useUpdateInvoiceFormatMutation();
  const [deleteFormat] = useDeleteInvoiceFormatMutation();
  const [assignStoreFormat] = useAssignStoreInvoiceFormatMutation();
  const [assignVendorFormat] = useAssignVendorInvoiceFormatMutation();

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      description: "",
      template: "",
      headerTemplate: "",
      footerTemplate: "",
      isDefault: false,
    },
  });

  // Open modal for create/edit
  const handleOpenModal = (format?: any) => {
    if (format) {
      setIsEditMode(true);
      setSelectedFormatId(format.id);
      setValue("name", format.name || "");
      setValue("description", format.description || "");
      setValue("template", format.template || "");
      setValue("headerTemplate", format.headerTemplate || "");
      setValue("footerTemplate", format.footerTemplate || "");
      setValue("isDefault", format.isDefault || false);
    } else {
      setIsEditMode(false);
      setSelectedFormatId("");
      reset();
    }
    onOpen();
  };

  // Handle create/update format
  const onSubmit = async (data: any) => {
    try {
      const formatData = {
        name: data.name,
        description: data.description || "",
        template: data.template || "",
        headerTemplate: data.headerTemplate || "",
        footerTemplate: data.footerTemplate || "",
        isDefault: data.isDefault || false,
      };

      let result;
      if (isEditMode) {
        result = await updateFormat({ id: selectedFormatId, ...formatData });
      } else {
        result = await createFormat(formatData);
      }

      if (result?.data?.success) {
        alert(isEditMode ? "Invoice format updated successfully" : "Invoice format created successfully");
        refetchFormats();
        onOpenChange();
        reset();
      } else {
        alert("Failed to save invoice format. Please try again.");
      }
    } catch (error) {
      console.error("Error saving format:", error);
      alert("Failed to save invoice format. Please try again.");
    }
  };

  // Handle delete format
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice format?")) return;

    try {
      const result = await deleteFormat(id);
      if (result?.data?.success) {
        alert("Invoice format deleted successfully");
        refetchFormats();
      } else {
        alert("Failed to delete invoice format. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting format:", error);
      alert("Failed to delete invoice format. Please try again.");
    }
  };

  // Handle assign format to store
  const handleAssignStoreFormat = async () => {
    if (!selectedStoreId || !selectedFormatId) {
      alert("Please select both store and invoice format");
      return;
    }

    try {
      const result = await assignStoreFormat({ storeId: selectedStoreId, formatId: selectedFormatId });
      if (result?.data?.success) {
        alert("Invoice format assigned to store successfully");
        onAssignModalChange();
        setSelectedStoreId("");
        setSelectedFormatId("");
        refetchAssignments();
      } else {
        alert("Failed to assign invoice format. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning format:", error);
      alert("Failed to assign invoice format. Please try again.");
    }
  };

  // Handle assign format to vendor
  const handleAssignVendorFormat = async () => {
    if (!selectedVendorId || !selectedFormatId) {
      alert("Please select both vendor and invoice format");
      return;
    }

    try {
      const result = await assignVendorFormat({ vendorId: selectedVendorId, formatId: selectedFormatId });
      if (result?.data?.success) {
        alert("Invoice format assigned to vendor successfully");
        onAssignModalChange();
        setSelectedVendorId("");
        setSelectedFormatId("");
        refetchAssignments();
      } else {
        alert("Failed to assign invoice format. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning format:", error);
      alert("Failed to assign invoice format. Please try again.");
    }
  };

  // Handle open product modal
  const handleOpenProductModal = (product?: any) => {
    if (product) {
      setIsProductEditMode(true);
      setSelectedProduct(product);
      setProductValue("name", product.name || "");
      setProductValue("description", product.description || product.sortDesc || "");
      setProductValue("price", product.total || product.price || "");
      setProductValue("categoryId", product.categoryId || "");
    } else {
      setIsProductEditMode(false);
      setSelectedProduct(null);
      resetProduct();
    }
    onProductModalOpen();
  };

  // Handle product submit (add/update)
  const onProductSubmit = async (data: any) => {
    try {
      const productData = {
        name: data.name,
        description: data.description || "",
        price: data.price || 0,
        categoryId: data.categoryId || null,
        storeId: currentRole === "3" ? storeId : undefined,
        vendorId: currentRole === "2" ? vendorId : undefined,
      };

      let result;
      if (isProductEditMode && selectedProduct) {
        result = await updateProduct({ ...productData, id: selectedProduct.id });
      } else {
        result = await addProduct(productData);
      }

      if (result?.data?.success) {
        alert(isProductEditMode ? "Product updated successfully" : "Product created successfully");
        if (currentRole === "0") refetchProducts();
        if (currentRole === "3") refetchStoreProducts();
        if (currentRole === "2") refetchVendorProducts();
        onProductModalChange();
        resetProduct();
        setSelectedProduct(null);
      } else {
        alert("Failed to save product. Please try again.");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (product: any) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      // Note: You may need to add a delete endpoint to Products API
      // For now, using update to set status to inactive or similar
      const result = await updateProduct({ 
        id: product.id, 
        status: "0" // Assuming 0 means inactive/deleted
      });
      
      if (result?.data?.success) {
        alert("Product deleted successfully");
        if (currentRole === "0") refetchProducts();
        if (currentRole === "3") refetchStoreProducts();
        if (currentRole === "2") refetchVendorProducts();
      } else {
        alert("Failed to delete product. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Invoice Formats</h1>
          <p className="text-sm text-gray-600">
            Manage invoice formats and assign them to stores or vendors
          </p>
        </CardHeader>
        <CardBody>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            aria-label="Invoice Formats tabs"
          >
            {/* Invoice Formats List */}
            <Tab key="formats" title="Invoice Formats">
              <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">All Invoice Formats</h3>
                  <div className="flex gap-2 items-center">
                    <Button
                      color="success"
                      variant="flat"
                      onPress={onCategoryModalOpen}
                    >
                      Manage Categories
                    </Button>
                    {selectedCategoryId && (
                      <Chip
                        color="primary"
                        variant="flat"
                        onClose={() => setSelectedCategoryId(null)}
                      >
                        {categoryData?.data?.find((cat: any) => cat.id === selectedCategoryId)?.name || `Category ${selectedCategoryId}`}
                      </Chip>
                    )}
                    <Button
                      color="secondary"
                      variant="flat"
                      onPress={() => {
                        // Pre-fill form with GST Tax Invoice format template
                        setValue("name", "GST Tax Invoice Format");
                        setValue("description", "GST compliant tax invoice with HSN/SAC codes, CGST/SGST breakdown, and bank details");
                        setValue("isDefault", false);
                        setValue("headerTemplate", `<style>
  body { font-family: Arial, sans-serif; font-size: 9px; color: #000; margin: 0; padding: 15px; }
  .invoice-box { width: 210mm; margin: auto; border: 1px solid #000; padding: 10px; box-sizing: border-box; }
  .header-top { display: flex; justify-content: space-between; position: relative; }
  .logo-section { width: 15%; text-align: left; vertical-align: top; }
  .logo-section img { width: 60px; height: auto; max-height: 60px; object-fit: contain; display: block; }
  .company-details { width: 70%; text-align: center; }
  .company-name { font-size: 14px; font-weight: bold; margin-bottom: 2px; }
  .original-tag { width: 15%; text-align: right; font-size: 8px; }
  .tax-invoice-bar { border: 1px solid #000; background: #f2f2f2; text-align: center; font-weight: bold; padding: 3px; margin: 5px 0; font-size: 11px; }
</style>
<div class="invoice-box">
  <div class="header-top">
    <div class="logo-section">
      <img src="{{storeLogo}}" alt="{{storeName}}" style="width: 60px; height: auto; max-height: 60px; display: block; object-fit: contain;" crossorigin="anonymous" />
    </div>
    <div class="company-details">
      <div class="company-name">{{storeName}}</div>
      {{storeAddress}}<br>
      LUT Ref No-{{lutRefNo}}, DT:{{lutDate}}<br>
      <strong>Mobile No : {{storePhone}}</strong><br>
      <strong>GSTIN : {{storeGSTIN}}</strong>
    </div>
    <div class="original-tag">Original for Recipient</div>
  </div>
  <div class="tax-invoice-bar">TAX INVOICE</div>`);
                        setValue("template", `<style>
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th, td { border: 1px solid #000; padding: 3px; vertical-align: top; word-wrap: break-word; }
  .address-table td { font-size: 8.5px; height: 100px; }
  .product-table th { background: #f2f2f2; font-size: 8px; }
  .product-table td { text-align: center; }
  .text-left { text-align: left !important; }
  .text-right { text-align: right !important; }
  .footer-grid { display: flex; border-left: 1px solid #000; border-right: 1px solid #000; border-bottom: 1px solid #000; }
  .bank-box { width: 25%; border-right: 1px solid #000; padding: 4px; }
  .gst-slab-box { width: 45%; border-right: 1px solid #000; }
  .total-box { width: 30%; }
  .nested-table { width: 100%; border: none; }
  .nested-table td { border: 0.5px solid #000; padding: 2px; }
  .terms-section { border: 1px solid #000; border-top: none; padding: 5px; position: relative; }
  .signatory-space { float: right; width: 200px; text-align: center; margin-top: 10px; }
  .computer-gen { text-align: center; font-size: 8px; margin-top: 5px; }
</style>
  <!-- Billing and Shipping Address -->
  <table class="address-table">
    <tr>
      <td>
        <strong>Billing Address: {{billingCompanyName}}</strong><br>
        {{billingAddress}}<br>
        Mobile No : {{billingPhone}}<br>
        GSTIN : {{billingGSTIN}}
      </td>
      <td>
        <strong>Shipping Address : {{shippingCompanyName}}</strong><br>
        {{shippingAddress}}
        <br><br>
        <strong>Other Ref :</strong> {{otherRef}}
      </td>
      <td>
        <strong>Inv No :</strong> {{billNumber}}<br>
        <strong>Date :</strong> {{invoiceDate}}<br>
        <strong>PO No :</strong> {{poNumber}}<br>
        <strong>Date :</strong> {{poDate}}<br>
        <strong>Month :</strong> {{invoiceMonth}}
      </td>
    </tr>
  </table>

  <!-- Products Table with GST -->
  <table class="product-table">
    <thead>
      <tr>
        <th width="20px">S No</th>
        <th width="180px">Product</th>
        <th>HSN/SAC</th>
        <th>UOM</th>
        <th>Qty</th>
        <th>Rate</th>
        <th>Amt</th>
        <th>CGST%</th>
        <th>CGST</th>
        <th>SGST%</th>
        <th>SGST</th>
        <th>Net</th>
      </tr>
    </thead>
    <tbody>
      {{products}}
    </tbody>
  </table>

  <!-- Footer Grid -->
  <div class="footer-grid">
    <div class="bank-box">
      <strong>Our Bank Details :</strong><br>
      Account Name : {{bankAccountName}}<br>
      Account Number : {{bankAccountNumber}}<br>
      IFS Code : {{bankIFSC}}<br><br>
      Bank Name & Branch : {{bankName}}
    </div>
    <div class="gst-slab-box">
      <table class="nested-table">
        <tr style="background:#f2f2f2; font-weight:bold;">
          <td>GST %</td><td>SALES</td><td>CGST</td><td>SGST</td><td>TOTAL</td>
        </tr>
        <tr><td>GST 0%</td><td>{{gst0Sales}}</td><td>{{gst0CGST}}</td><td>{{gst0SGST}}</td><td>{{gst0Total}}</td></tr>
        <tr><td>GST 5%</td><td>{{gst5Sales}}</td><td>{{gst5CGST}}</td><td>{{gst5SGST}}</td><td>{{gst5Total}}</td></tr>
        <tr><td>GST 12%</td><td>{{gst12Sales}}</td><td>{{gst12CGST}}</td><td>{{gst12SGST}}</td><td>{{gst12Total}}</td></tr>
        <tr><td>GST 18%</td><td>{{gst18Sales}}</td><td>{{gst18CGST}}</td><td>{{gst18SGST}}</td><td>{{gst18Total}}</td></tr>
        <tr><td>GST 28%</td><td>{{gst28Sales}}</td><td>{{gst28CGST}}</td><td>{{gst28SGST}}</td><td>{{gst28Total}}</td></tr>
        <tr style="font-weight:bold;"><td>Grand Total</td><td>{{taxableAmount}}</td><td>{{totalCGST}}</td><td>{{totalSGST}}</td><td>{{totalAmount}}</td></tr>
      </table>
    </div>
    <div class="total-box">
      <table class="nested-table">
        <tr><td>Taxable Amount</td><td class="text-right">{{taxableAmount}}</td></tr>
        <tr><td>CGST :</td><td class="text-right">{{totalCGST}}</td></tr>
        <tr><td>SGST :</td><td class="text-right">{{totalSGST}}</td></tr>
        <tr><td>IGST :</td><td class="text-right">{{totalIGST}}</td></tr>
        <tr><td>Total Tax :</td><td class="text-right">{{totalTax}}</td></tr>
        <tr style="font-weight:bold; font-size:10px;"><td>Total Amount :</td><td class="text-right">{{totalAmount}}</td></tr>
      </table>
    </div>
  </div>
</div>`);
                        setValue("footerTemplate", `<div class="terms-section">
  <strong>Amount in Words: {{amountInWords}}</strong><br><br>
  <strong>Terms & Conditions :</strong><br>
  1. Goods once sold cannot be taken back or exchanged.<br>
  2. Dispute : If any arising from this deal are subject to {{jurisdiction}} Jurisdiction.<br>
  <strong>Company's PAN : {{storePAN}}</strong><br>
  <strong>NOTE :</strong>
  <div class="signatory-space">
    <strong>{{storeName}}</strong><br><br><br>
    Authorised Signatory
  </div>
  <div style="clear:both;"></div>
</div>
<div class="computer-gen">* This is Computer Generated Invoice *</div>
</div>`);
                        setIsEditMode(false);
                        setSelectedFormatId("");
                        onOpen();
                      }}
                    >
                      Use GST Tax Invoice Template
                    </Button>
                    <Button
                      color="secondary"
                      variant="flat"
                      onPress={() => {
                        // Pre-fill form with default format template
                        setValue("name", "Default Invoice Format");
                        setValue("description", "Standard invoice format with company header, itemized list, and footer");
                        setValue("isDefault", false);
                        setValue("headerTemplate", `<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
  <div style="flex: 1;">
    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">{{billDate}}</div>
    <div style="font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px;">INVOICE</div>
  </div>
  <div style="text-align: right; flex: 1;">
    <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">{{storeName}}</div>
    <div style="font-size: 12px; color: #666;">Invoice #{{billNumber}}</div>
    <div style="font-size: 12px; color: #666;">Date: {{invoiceDate}}</div>
  </div>
</div>`);
                        setValue("template", `<div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <!-- Company Information -->
  <div style="margin-bottom: 30px;">
    <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">{{storeName}}</div>
    <div style="font-size: 12px; color: #666; line-height: 1.6;">
      <div>{{storeAddress}}</div>
      <div>Phone: {{storePhone}}</div>
      <div>Email: {{storeEmail}}</div>
      <div>Website: {{storeWebsite}}</div>
    </div>
  </div>

  <!-- Bill To Section -->
  <div style="margin-bottom: 30px;">
    <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">Bill To:</div>
    <div style="font-size: 12px; color: #666;">
      <div>{{customerName}}</div>
      <div>{{customerEmail}}</div>
      <div>{{customerPhone}}</div>
    </div>
  </div>

  <!-- Invoice Details -->
  <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Invoice Number</div>
      <div style="font-size: 14px; font-weight: bold;">{{billNumber}}</div>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Invoice Date</div>
      <div style="font-size: 14px; font-weight: bold;">{{invoiceDate}}</div>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Status</div>
      <div style="font-size: 14px; font-weight: bold; color: #10b981;">{{status}}</div>
    </div>
  </div>

  <!-- Products Table -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>
      <tr style="background-color: #2563eb; color: white;">
        <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">ITEM</th>
        <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">SIZE</th>
        <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold;">QUANTITY</th>
        <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">UNIT PRICE</th>
        <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">TOTAL</th>
      </tr>
    </thead>
    <tbody>
      {{products}}
    </tbody>
  </table>

  <!-- Summary Section -->
  <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <span style="font-size: 14px; color: #666;">Subtotal:</span>
      <span style="font-size: 14px; font-weight: bold;">₹{{subtotal}}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <span style="font-size: 14px; color: #666;">Discount ({{discountPercent}}%):</span>
      <span style="font-size: 14px; color: #ef4444;">-₹{{discount}}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <span style="font-size: 14px; color: #666;">Tax ({{taxPercent}}%):</span>
      <span style="font-size: 14px; font-weight: bold;">₹{{tax}}</span>
    </div>
    <div style="border-top: 2px solid #2563eb; padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between;">
      <span style="font-size: 18px; font-weight: bold; color: #2563eb;">Total:</span>
      <span style="font-size: 18px; font-weight: bold; color: #2563eb;">₹{{total}}</span>
    </div>
  </div>
</div>`);
                        setValue("footerTemplate", `<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">Thank you for your business!</div>
  <div style="font-size: 12px; color: #666;">This is a computer-generated invoice and does not require a signature.</div>
  <div style="margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; font-size: 12px; color: #666;">
    <strong>Notes:</strong> {{notes}}
  </div>
</div>`);
                        setIsEditMode(false);
                        setSelectedFormatId("");
                        onOpen();
                      }}
                    >
                      Use Default Template
                    </Button>
                    <Button color="primary" onPress={() => handleOpenModal()}>
                      + Create New Format
                    </Button>
                  </div>
                </div>

                {formatsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <Table aria-label="Invoice Formats Table">
                    <TableHeader>
                      <TableColumn>Name</TableColumn>
                      <TableColumn>Description</TableColumn>
                      <TableColumn>Default</TableColumn>
                      <TableColumn>Created Date</TableColumn>
                      <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody
                      items={formatsData?.data || []}
                      emptyContent={
                        <p className="text-center text-gray-500 py-4">
                          No invoice formats found. Create one to get started.
                        </p>
                      }
                    >
                      {(format: any) => (
                        <TableRow key={format.id}>
                          <TableCell>
                            <span className="font-medium">{format.name}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {format.description || "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={format.isDefault ? "success" : "default"}
                              variant="flat"
                              size="sm"
                            >
                              {format.isDefault ? "Default" : "Custom"}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            {format.createdAt
                              ? new Date(format.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="flat"
                                color="default"
                                onPress={() => {
                                  setViewingFormat(format);
                                  onViewModalOpen();
                                }}
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                onPress={() => handleOpenModal(format)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="flat"
                                color="danger"
                                onPress={() => handleDelete(format.id)}
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

            {/* Products Management Tab */}
            <Tab key="products" title="Products">
              <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Products</h3>
                  <Button color="primary" onPress={() => handleOpenProductModal()}>
                    + Add Product
                  </Button>
                </div>

                {isLoadingProducts ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <Table aria-label="Products Table">
                    <TableHeader>
                      <TableColumn>Name</TableColumn>
                      <TableColumn>Description</TableColumn>
                      <TableColumn>Price</TableColumn>
                      <TableColumn>Category</TableColumn>
                      <TableColumn>Status</TableColumn>
                      <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody
                      items={products}
                      emptyContent={
                        <p className="text-center text-gray-500 py-4">
                          No products found. Create one to get started.
                        </p>
                      }
                    >
                      {(product: any) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <span className="font-medium">{product.name || product.productName}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {product.description || product.sortDesc || "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">₹{product.total || product.price || "0.00"}</span>
                          </TableCell>
                          <TableCell>
                            {product.categoryId ? (
                              <Chip size="sm" variant="flat">
                                {categoryData?.data?.find((cat: any) => cat.id === product.categoryId)?.name || `Category ${product.categoryId}`}
                              </Chip>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={product.status === "1" || product.status === 1 ? "success" : "default"}
                              variant="flat"
                              size="sm"
                            >
                              {product.status === "1" || product.status === 1 ? "Active" : "Inactive"}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                onPress={() => handleOpenProductModal(product)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="flat"
                                color="danger"
                                onPress={() => handleDeleteProduct(product)}
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

            {/* Admin: Assign Formats to Stores/Vendors */}
            {currentRole === "0" && (
              <Tab key="assign" title="Assign Formats">
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Assign Invoice Formats</h3>
                    <div className="flex gap-2">
                      <Button
                        color="secondary"
                        variant="flat"
                        onPress={onAssignedListModalOpen}
                      >
                        View Assigned List
                      </Button>
                      <Button color="primary" onPress={onAssignModalOpen}>
                        + Assign Format
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Stores Assignment */}
                    <Card>
                      <CardHeader>
                        <h4 className="text-md font-semibold">Stores</h4>
                      </CardHeader>
                      <CardBody>
                        {storesLoading || assignmentsLoading ? (
                          <Spinner size="sm" />
                        ) : (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {storesData?.data?.map((store: any) => {
                              const assignment = assignmentsMap[`store-${store.id}`];
                              return (
                                <div
                                  key={store.id}
                                  className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
                                >
                                  <span className="flex-1">{store.storename || store.name || `Store ${store.id}`}</span>
                                  {assignment ? (
                                    <div className="flex items-center gap-2">
                                      <Chip
                                        color={assignment.isDefault ? "warning" : "success"}
                                        variant="flat"
                                        size="sm"
                                      >
                                        {assignment.formatName}
                                      </Chip>
                                      <Button
                                        size="sm"
                                        variant="light"
                                        color="primary"
                                        onPress={() => {
                                          setSelectedStoreId(store.id.toString());
                                          setSelectedFormatId(assignment.formatId.toString());
                                          onAssignModalOpen();
                                        }}
                                      >
                                        Change
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="flat"
                                      color="default"
                                      onPress={() => {
                                        setSelectedStoreId(store.id.toString());
                                        setSelectedFormatId("");
                                        onAssignModalOpen();
                                      }}
                                    >
                                      Not Assigned
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </CardBody>
                    </Card>

                    {/* Vendors Assignment */}
                    <Card>
                      <CardHeader>
                        <h4 className="text-md font-semibold">Vendors</h4>
                      </CardHeader>
                      <CardBody>
                        {vendorsLoading || assignmentsLoading ? (
                          <Spinner size="sm" />
                        ) : (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {vendorsData?.data?.map((vendor: any) => {
                              const assignment = assignmentsMap[`vendor-${vendor.id}`];
                              return (
                                <div
                                  key={vendor.id}
                                  className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
                                >
                                  <span className="flex-1">{vendor.name || vendor.vendorname || `Vendor ${vendor.id}`}</span>
                                  {assignment ? (
                                    <div className="flex items-center gap-2">
                                      <Chip
                                        color={assignment.isDefault ? "warning" : "success"}
                                        variant="flat"
                                        size="sm"
                                      >
                                        {assignment.formatName}
                                      </Chip>
                                      <Button
                                        size="sm"
                                        variant="light"
                                        color="primary"
                                        onPress={() => {
                                          setSelectedVendorId(vendor.id.toString());
                                          setSelectedFormatId(assignment.formatId.toString());
                                          onAssignModalOpen();
                                        }}
                                      >
                                        Change
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="flat"
                                      color="default"
                                      onPress={() => {
                                        setSelectedVendorId(vendor.id.toString());
                                        setSelectedFormatId("");
                                        onAssignModalOpen();
                                      }}
                                    >
                                      Not Assigned
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Tab>
            )}
          </Tabs>
        </CardBody>
      </Card>

      {/* Create/Edit Format Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>
                {isEditMode ? "Edit Invoice Format" : "Create New Invoice Format"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        label="Format Name"
                        placeholder="Enter format name"
                        {...field}
                        isRequired
                      />
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        label="Description"
                        placeholder="Enter format description"
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="headerTemplate"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        label="Header Template (HTML)"
                        placeholder="Enter header HTML template"
                        minRows={3}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="template"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        label="Body Template (HTML)"
                        placeholder="Enter body HTML template"
                        minRows={5}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="footerTemplate"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        label="Footer Template (HTML)"
                        placeholder="Enter footer HTML template"
                        minRows={3}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="isDefault"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Is Default"
                        selectedKeys={field.value ? ["true"] : ["false"]}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected === "true");
                        }}
                      >
                        <SelectItem key="true" value="true">
                          Yes
                        </SelectItem>
                        <SelectItem key="false" value="false">
                          No
                        </SelectItem>
                      </Select>
                    )}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  {isEditMode ? "Update" : "Create"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Assign Format Modal */}
      <Modal isOpen={isAssignModalOpen} onOpenChange={onAssignModalChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Assign Invoice Format</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Select
                    label="Select Invoice Format"
                    placeholder="Choose an invoice format"
                    selectedKeys={selectedFormatId ? [selectedFormatId] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setSelectedFormatId(selected || "");
                    }}
                    isLoading={formatsLoading}
                  >
                    {formatsData?.data?.map((format: any) => (
                      <SelectItem key={format.id} value={format.id}>
                        {format.name}
                      </SelectItem>
                    ))}
                  </Select>

                  {(selectedStoreId || selectedVendorId) && (
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-700">
                        {selectedStoreId
                          ? `Store: ${storesData?.data?.find((s: any) => s.id.toString() === selectedStoreId)?.storename || storesData?.data?.find((s: any) => s.id.toString() === selectedStoreId)?.name || `Store ${selectedStoreId}`}`
                          : `Vendor: ${vendorsData?.data?.find((v: any) => v.id.toString() === selectedVendorId)?.name || vendorsData?.data?.find((v: any) => v.id.toString() === selectedVendorId)?.vendorname || `Vendor ${selectedVendorId}`}`}
                      </p>
                    </div>
                  )}

                  {!selectedStoreId && !selectedVendorId && (
                    <>
                      <Select
                        label="Select Store"
                        placeholder="Choose a store"
                        selectedKeys={selectedStoreId ? [selectedStoreId] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setSelectedStoreId(selected || "");
                          setSelectedVendorId("");
                        }}
                        isLoading={storesLoading}
                      >
                        {storesData?.data?.map((store: any) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.storename || store.name || `Store ${store.id}`}
                          </SelectItem>
                        ))}
                      </Select>

                      <Select
                        label="Select Vendor"
                        placeholder="Choose a vendor"
                        selectedKeys={selectedVendorId ? [selectedVendorId] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setSelectedVendorId(selected || "");
                          setSelectedStoreId("");
                        }}
                        isLoading={vendorsLoading}
                      >
                        {vendorsData?.data?.map((vendor: any) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name || vendor.vendorname || `Vendor ${vendor.id}`}
                          </SelectItem>
                        ))}
                      </Select>
                    </>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (selectedStoreId) {
                      handleAssignStoreFormat();
                    } else if (selectedVendorId) {
                      handleAssignVendorFormat();
                    } else {
                      alert("Please select store or vendor");
                    }
                  }}
                >
                  Assign
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* View Format Modal */}
      <Modal isOpen={isViewModalOpen} onOpenChange={onViewModalChange} size="5xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex justify-between items-center w-full">
                  <span>View Invoice Format: {viewingFormat?.name || formatDetailsData?.data?.name}</span>
                  <Chip
                    color={viewingFormat?.isDefault || formatDetailsData?.data?.isDefault ? "success" : "default"}
                    variant="flat"
                    size="sm"
                  >
                    {viewingFormat?.isDefault || formatDetailsData?.data?.isDefault ? "Default" : "Custom"}
                  </Chip>
                </div>
              </ModalHeader>
              <ModalBody>
                {formatDetailsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-gray-600">
                        {formatDetailsData?.data?.description || viewingFormat?.description || "No description"}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Header Template</h4>
                      <div className="border rounded p-3 bg-gray-50 max-h-60 overflow-auto">
                        <pre className="text-xs whitespace-pre-wrap">
                          {formatDetailsData?.data?.headerTemplate || viewingFormat?.headerTemplate || "No header template"}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Body Template</h4>
                      <div className="border rounded p-3 bg-gray-50 max-h-96 overflow-auto">
                        <pre className="text-xs whitespace-pre-wrap">
                          {formatDetailsData?.data?.template || viewingFormat?.template || "No body template"}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Footer Template</h4>
                      <div className="border rounded p-3 bg-gray-50 max-h-60 overflow-auto">
                        <pre className="text-xs whitespace-pre-wrap">
                          {formatDetailsData?.data?.footerTemplate || viewingFormat?.footerTemplate || "No footer template"}
                        </pre>
                      </div>
                    </div>

                    <div className="flex gap-2 text-sm text-gray-600">
                      <span>
                        <strong>Created:</strong>{" "}
                        {formatDetailsData?.data?.createdAt || viewingFormat?.createdAt
                          ? new Date(formatDetailsData?.data?.createdAt || viewingFormat?.createdAt).toLocaleString()
                          : "-"}
                      </span>
                      <span>
                        <strong>Updated:</strong>{" "}
                        {formatDetailsData?.data?.updatedAt || viewingFormat?.updatedAt
                          ? new Date(formatDetailsData?.data?.updatedAt || viewingFormat?.updatedAt).toLocaleString()
                          : "-"}
                      </span>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    handleOpenModal(viewingFormat || formatDetailsData?.data);
                  }}
                >
                  Edit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Assigned List Modal */}
      <Modal isOpen={isAssignedListModalOpen} onOpenChange={onAssignedListModalChange} size="4xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Invoice Format Assignments</ModalHeader>
              <ModalBody>
                {assignmentsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <Card>
                        <CardBody className="p-4">
                          <div className="text-sm text-gray-600">Total Assignments</div>
                          <div className="text-2xl font-bold">{assignmentsData?.data?.total || 0}</div>
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody className="p-4">
                          <div className="text-sm text-gray-600">Stores</div>
                          <div className="text-2xl font-bold">{assignmentsData?.count?.stores || 0}</div>
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody className="p-4">
                          <div className="text-sm text-gray-600">Vendors</div>
                          <div className="text-2xl font-bold">{assignmentsData?.count?.vendors || 0}</div>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Stores Assignments */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Stores ({assignmentsData?.count?.stores || 0})</h4>
                      <Table aria-label="Store Assignments Table">
                        <TableHeader>
                          <TableColumn>Store Name</TableColumn>
                          <TableColumn>Invoice Format</TableColumn>
                          <TableColumn>Default Format</TableColumn>
                          <TableColumn>Assigned Date</TableColumn>
                        </TableHeader>
                        <TableBody
                          items={assignmentsData?.data?.stores || []}
                          emptyContent={
                            <p className="text-center text-gray-500 py-4">
                              No store assignments found
                            </p>
                          }
                        >
                          {(item: any) => (
                            <TableRow key={item.id || item.storeId}>
                              <TableCell>
                                {item.store?.name || item.storeName || `Store ${item.storeId || item.store?.id}`}
                              </TableCell>
                              <TableCell>
                                {item.format?.name || item.formatName ? (
                                  <Chip color="success" variant="flat" size="sm">
                                    {item.format?.name || item.formatName}
                                  </Chip>
                                ) : (
                                  <Chip color="default" variant="flat" size="sm">
                                    Not Assigned
                                  </Chip>
                                )}
                              </TableCell>
                              <TableCell>
                                {item.format?.isDefault ? (
                                  <Chip color="warning" variant="flat" size="sm">
                                    Default
                                  </Chip>
                                ) : (
                                  <Chip color="default" variant="flat" size="sm">
                                    Custom
                                  </Chip>
                                )}
                              </TableCell>
                              <TableCell>
                                {item.createdAt || item.assignedAt
                                  ? new Date(item.createdAt || item.assignedAt).toLocaleDateString()
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Vendors Assignments */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Vendors ({assignmentsData?.count?.vendors || 0})</h4>
                      <Table aria-label="Vendor Assignments Table">
                        <TableHeader>
                          <TableColumn>Vendor Name</TableColumn>
                          <TableColumn>Invoice Format</TableColumn>
                          <TableColumn>Default Format</TableColumn>
                          <TableColumn>Assigned Date</TableColumn>
                        </TableHeader>
                        <TableBody
                          items={assignmentsData?.data?.vendors || []}
                          emptyContent={
                            <p className="text-center text-gray-500 py-4">
                              No vendor assignments found
                            </p>
                          }
                        >
                          {(item: any) => (
                            <TableRow key={item.id || item.vendorId}>
                              <TableCell>
                                {item.vendor?.name || item.vendorName || `Vendor ${item.vendorId || item.vendor?.id}`}
                              </TableCell>
                              <TableCell>
                                {item.format?.name || item.formatName ? (
                                  <Chip color="success" variant="flat" size="sm">
                                    {item.format?.name || item.formatName}
                                  </Chip>
                                ) : (
                                  <Chip color="default" variant="flat" size="sm">
                                    Not Assigned
                                  </Chip>
                                )}
                              </TableCell>
                              <TableCell>
                                {item.format?.isDefault ? (
                                  <Chip color="warning" variant="flat" size="sm">
                                    Default
                                  </Chip>
                                ) : (
                                  <Chip color="default" variant="flat" size="sm">
                                    Custom
                                  </Chip>
                                )}
                              </TableCell>
                              <TableCell>
                                {item.createdAt || item.assignedAt
                                  ? new Date(item.createdAt || item.assignedAt).toLocaleDateString()
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
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

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onOpenChange={onCategoryModalChange}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={(categoryId) => {
          setSelectedCategoryId(categoryId);
          const categoryName = categoryData?.data?.find((cat: any) => cat.id === categoryId)?.name;
          if (categoryId && categoryName) {
            // Optionally show a success message
            console.log(`Category selected: ${categoryName} (ID: ${categoryId})`);
          }
        }}
        label="Manage Categories"
      />

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isProductModalOpen} onOpenChange={onProductModalChange} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleProductSubmit(onProductSubmit)}>
              <ModalHeader>
                {isProductEditMode ? "Edit Product" : "Add New Product"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Controller
                    name="name"
                    control={productControl}
                    rules={{ required: "Product name is required" }}
                    render={({ field, fieldState }) => (
                      <Input
                        label="Product Name"
                        placeholder="Enter product name"
                        {...field}
                        isRequired
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                      />
                    )}
                  />

                  <Controller
                    name="description"
                    control={productControl}
                    render={({ field }) => (
                      <Textarea
                        label="Description"
                        placeholder="Enter product description"
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="price"
                    control={productControl}
                    rules={{ 
                      required: "Price is required",
                      min: { value: 0, message: "Price must be greater than or equal to 0" }
                    }}
                    render={({ field, fieldState }) => (
                      <Input
                        label="Price"
                        placeholder="Enter product price"
                        type="number"
                        step="0.01"
                        {...field}
                        isRequired
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                      />
                    )}
                  />

                  <Controller
                    name="categoryId"
                    control={productControl}
                    render={({ field }) => (
                      <Select
                        label="Category"
                        placeholder="Select a category"
                        selectedKeys={field.value ? [String(field.value)] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected ? Number(selected) : null);
                        }}
                      >
                        {categoryData?.data?.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  {isProductEditMode ? "Update" : "Create"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default InvoiceFormats;

