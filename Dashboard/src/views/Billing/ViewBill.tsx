import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useGetBillByIdQuery, useUpdateBillMutation } from "./Service.mjs";
import { infoData } from "../../configData";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { useGetStoresByIDQuery } from "../Store/Service.mjs";
import { useGetInvoiceFormatByIdQuery } from "../InvoiceFormats/Service.mjs";
import { useGetClientsQuery } from "../Inventory/Service.mjs";
import { Select, SelectItem } from "@nextui-org/react";

// Sample bill data for testing
const sampleBillData = {
  id: 1,
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  customerPhone: "+91 9876543210",
  subtotal: "5000.00",
  discount: "250.00",
  tax: "475.00",
  total: "5225.00",
  createdAt: "2024-01-15T10:30:00Z",
  notes: "Regular customer - 5% discount applied",
  products: '[{"quantity":2,"price":1500,"total":3000},{"quantity":1,"price":2000,"total":2000}]',
};

const ViewBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, refetch } = useGetBillByIdQuery(Number(id), {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const [updateBill, { isLoading: isUpdating }] = useUpdateBillMutation();

  const storeId = getCookie("storeId");
  const { data: storeData, error: storeError, refetch: storeRefetch } = useGetStoresByIDQuery(
    Number(storeId), { skip: !storeId, refetchOnMountOrArgChange: true }
  );

  const store = storeData?.data || null;

  // Get invoice format ID from bill data (check multiple possible field names)
  const invoiceFormatId = React.useMemo(() => {
    const rawData = data?.data || {};
    const formatId =
      rawData.invoiceFormatId ||
      rawData.invoice_format_id ||
      rawData.invoiceFormat?.id ||
      rawData.formatId ||
      null;
    console.log('[ViewBill] Invoice Format ID from bill:', formatId, 'Bill data keys:', Object.keys(rawData));
    return formatId;
  }, [data]);

  // Fetch invoice format details
  const { data: invoiceFormatData, isLoading: isLoadingFormat, error: formatError } = useGetInvoiceFormatByIdQuery(
    invoiceFormatId ? String(invoiceFormatId) : "",
    { skip: !invoiceFormatId, refetchOnMountOrArgChange: true }
  );

  const invoiceFormat = invoiceFormatData?.data;

  // Debug logging
  React.useEffect(() => {
    console.log('[ViewBill] Invoice Format Debug:', {
      invoiceFormatId,
      hasFormatData: !!invoiceFormatData,
      invoiceFormat,
      isLoadingFormat,
      formatError,
    });
  }, [invoiceFormatId, invoiceFormatData, invoiceFormat, isLoadingFormat, formatError]);

  // Parse products from JSON string and process bill data
  const processBillData = React.useMemo(() => {
    const rawData = data?.data || sampleBillData;

    // Parse products JSON string
    let products = [];
    try {
      if (typeof rawData.products === 'string') {
        products = JSON.parse(rawData.products);
      } else if (Array.isArray(rawData.products)) {
        products = rawData.products;
      }
    } catch (e) {
      console.error('Error parsing products:', e);
      products = [];
    }

    return {
      ...rawData,
      products: products,
      subtotal: Number(rawData.subtotal) || 0,
      discount: Number(rawData.discount) || 0,
      tax: Number(rawData.tax) || 0,
      total: Number(rawData.total) || 0,
    };
  }, [data]);

  const billData = processBillData;

  // Editable invoice data state
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editedData, setEditedData] = React.useState<any>(null);
  const { isOpen: isProductModalOpen, onOpen: onProductModalOpen, onClose: onProductModalClose } = useDisclosure();
  const [editingProductIndex, setEditingProductIndex] = React.useState<number | null>(null);

  // Client and branch selection
  const { data: clientsData } = useGetClientsQuery({});
  const [selectedClientId, setSelectedClientId] = React.useState<number | null>(null);
  const [selectedBranchIndex, setSelectedBranchIndex] = React.useState<number | null>(null);

  // Get selected client and branches
  const selectedClient = selectedClientId ? clientsData?.data?.find((c: any) => c.id === selectedClientId) : null;
  const branches = selectedClient?.branches ? (typeof selectedClient.branches === 'string' ? JSON.parse(selectedClient.branches) : selectedClient.branches) : [];
  const selectedBranch = selectedBranchIndex !== null ? branches[selectedBranchIndex] : null;

  // Preload logo image to ensure it's available for rendering
  React.useEffect(() => {
    const logoUrl = "https://nicknameinfotech.com/img/new-logo.png";
    if (logoUrl) {
      const img = document.createElement('img');
      img.src = logoUrl;
      img.onload = () => console.log('[ViewBill] Logo image preloaded successfully');
      img.onerror = () => console.warn('[ViewBill] Failed to preload logo image:', logoUrl);
    }
  }, [store?.logo, store?.logoUrl]);

  // Initialize edited data when bill data changes
  // Map API response (camelCase) to editedData (snake_case)
  React.useEffect(() => {
    if (billData) {
      // Parse products from API response (could be string or array)
      let products = [];
      try {
        if (typeof billData.products === 'string') {
          products = JSON.parse(billData.products);
        } else if (Array.isArray(billData.products)) {
          products = billData.products;
        }
      } catch (e) {
        console.error('[ViewBill] Error parsing products:', e);
        products = [];
      }

      // Parse termsConditions from API response (could be string or array)
      let termsConditions = [];
      try {
        if (billData.termsConditions) {
          if (typeof billData.termsConditions === 'string') {
            termsConditions = JSON.parse(billData.termsConditions);
          } else if (Array.isArray(billData.termsConditions)) {
            termsConditions = billData.termsConditions;
          }
        }
      } catch (e) {
        console.error('[ViewBill] Error parsing termsConditions:', e);
        termsConditions = [];
      }

      // If termsConditions is empty, use default terms
      if (termsConditions.length === 0) {
        termsConditions = [
          { id: 1, text: "1. Goods once sold cannot be taken back or exchanged." },
          { id: 2, text: `2. Dispute : If any arising from this deal are subject to ${store?.jurisdiction || "Chennai"} Jurisdiction.` },
        ];
      }

      // Parse gstBreakdown from API response (could be string or array)
      let gstBreakdown = [];
      try {
        if (billData.gstBreakdown) {
          if (typeof billData.gstBreakdown === 'string') {
            gstBreakdown = JSON.parse(billData.gstBreakdown);
          } else if (Array.isArray(billData.gstBreakdown)) {
            gstBreakdown = billData.gstBreakdown;
          }
        }
      } catch (e) {
        console.error('[ViewBill] Error parsing gstBreakdown:', e);
        gstBreakdown = [];
      }

      setEditedData({
        // Company/Store info - use API response (camelCase) when available, fallback to store
        company_name: billData.companyName || store?.storename || store?.name || "",
        company_short_name: billData.companyShortName || (store?.storename || store?.name || "").split(" ")[0] || "",
        company_suffix: billData.companySuffix || (store?.storename || store?.name || "").split(" ").slice(1).join(" ") || "",
        company_address: billData.companyAddress || store?.storeaddress || "",
        company_mobile: billData.companyMobile || store?.phone || "",
        company_gstin: billData.companyGSTIN || store?.gstin || store?.gstNumber || store?.GSTNo || "",
        lut_ref: billData.lutRef || store?.lutRefNo || "",
        lut_date: billData.lutDate || store?.lutDate || "",

        // Invoice info - use API response (camelCase) when available
        invoice_no: billData.invoiceNumber || billData.billNumber || `INV-${billData.id}`,
        invoice_date: billData.invoiceDate || billData.createdAt || "",
        invoice_month: billData.invoiceMonth || new Date(billData.invoiceDate || billData.createdAt || new Date()).toLocaleString('en-US', { month: 'long' }),
        po_no: billData.poNumber || billData.purchaseOrderNumber || "",
        po_date: billData.poDate || "",
        invoice_title: billData.invoiceTitle || "TAX INVOICE",
        invoice_copy_type: billData.invoiceCopyType || "Original for Recipient",

        // Billing info - use API response (camelCase) when available
        billing_name: billData.customerName || billData.billingCompanyName || "",
        billing_address: billData.billingAddress || billData.customerAddress || "",
        billing_mobile: billData.customerPhone || billData.billingPhone || "",
        billing_gstin: billData.billingGSTIN || billData.customerGSTIN || "",

        // Shipping info - use API response (camelCase) when available
        shipping_name: billData.shippingCompanyName || billData.customerName || "",
        shipping_address: billData.shippingAddress || billData.customerAddress || "",

        // Bank details - use API response (camelCase) when available, fallback to store
        bank_account_name: billData.bankAccountName || store?.bankAccountName || store?.accountName || store?.storename || "",
        bank_account_number: billData.bankAccountNumber || store?.bankAccountNumber || store?.accountNumber || "",
        bank_ifsc: billData.bankIFSC || store?.bankIFSC || store?.ifscCode || "",
        bank_name_branch: billData.bankNameBranch || store?.bankName || store?.bankNameBranch || "",

        // Financial info - use API response values
        taxable_amount: Number(billData.subtotal) || 0,
        total_cgst: Number(billData.totalCGST) || 0,
        total_sgst: Number(billData.totalSGST) || 0,
        total_tax: Number(billData.tax) || 0,
        final_amount: Number(billData.total) || 0,
        grand_taxable: Number(billData.subtotal) || 0,
        grand_cgst: Number(billData.totalCGST) || 0,
        grand_sgst: Number(billData.totalSGST) || 0,
        grand_total: Number(billData.total) || 0,

        // Terms - use parsed termsConditions from API response
        terms_condition_1: termsConditions[0]?.text || "1. Goods once sold cannot be taken back or exchanged.",
        terms_condition_2: termsConditions[1]?.text || `2. Dispute : If any arising from this deal are subject to ${store?.jurisdiction || "Chennai"} Jurisdiction.`,
        terms_conditions: termsConditions,

        // Products - use parsed products from API response
        products: products,

        // GST Breakdown - use parsed gstBreakdown from API response, or calculate from products if empty
        gst_breakdown: gstBreakdown.length > 0 ? gstBreakdown : [],
      });
    }
  }, [billData, store]);

  // Initialize and update GST breakdown from calculated values when products change
  // Use a ref to track if we're manually editing GST breakdown to avoid overriding
  const isManuallyEditingGST = React.useRef(false);
  const lastProductsHash = React.useRef<string>('');

  React.useEffect(() => {
    // Only recalculate GST breakdown if:
    // 1. We have products
    // 2. GST breakdown is empty or was calculated from products (not from API)
    // 3. We're not manually editing GST
    if (editedData && editedData.products && Array.isArray(editedData.products) && editedData.products.length > 0) {
      // Check if GST breakdown exists and has data from API (has non-standard rates or manual entries)
      const hasApiGstBreakdown = editedData.gst_breakdown && 
        editedData.gst_breakdown.length > 0 &&
        editedData.gst_breakdown.some((entry: any) => {
          const standardRates = [0, 5, 12, 18, 28];
          // If entry has a rate that's not in standard rates, or has manual data, it's from API
          return !standardRates.includes(entry.rate) || 
                 (entry.sales > 0 && entry.rate !== Math.round(entry.rate));
        });

      // Create a hash of products to detect changes
      const productsHash = JSON.stringify(editedData.products.map((p: any) => ({
        quantity: p.quantity || 0,
        price: p.price || p.rate || 0,
        gstRate: p.gstRate || p.gstPercent || 0,
        name: p.name || p.productName || '',
      })));

      // Only recalculate if:
      // - Products changed AND
      // - We're not manually editing GST AND
      // - GST breakdown is empty or was calculated (not from API with manual data)
      if (lastProductsHash.current !== productsHash && 
          !isManuallyEditingGST.current && 
          (!hasApiGstBreakdown || !editedData.gst_breakdown || editedData.gst_breakdown.length === 0)) {
        lastProductsHash.current = productsHash;
        
        const gstCalc = calculateGSTBreakdownFromProducts(editedData.products);
        const gstRates = [0, 5, 12, 18, 28];
        const gstBreakdown = gstRates.map(rate => ({
          id: rate,
          rate: rate,
          sales: gstCalc.breakdownByRate[rate]?.sales || 0,
          cgst: gstCalc.breakdownByRate[rate]?.cgst || 0,
          sgst: gstCalc.breakdownByRate[rate]?.sgst || 0,
          total: gstCalc.breakdownByRate[rate]?.total || 0,
        }));
        
        setEditedData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            gst_breakdown: gstBreakdown,
          };
        });
      }
    } else if (editedData && (!editedData.products || editedData.products.length === 0)) {
      // Reset GST breakdown if no products (only if not from API)
      if (!editedData.gst_breakdown || editedData.gst_breakdown.length === 0) {
        const gstRates = [0, 5, 12, 18, 28];
        const emptyGstBreakdown = gstRates.map(rate => ({
          id: rate,
          rate: rate,
          sales: 0,
          cgst: 0,
          sgst: 0,
          total: 0,
        }));
        setEditedData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            gst_breakdown: emptyGstBreakdown,
          };
        });
      }
    }
  }, [editedData?.products, editedData?.gst_breakdown]);

  // Auto-calculate financial totals when GST breakdown changes
  React.useEffect(() => {
    if (editedData && editedData.gst_breakdown && editedData.gst_breakdown.length > 0 && isEditMode) {
      let totalTaxableAmount = 0;
      let totalCGST = 0;
      let totalSGST = 0;

      editedData.gst_breakdown.forEach((entry: any) => {
        totalTaxableAmount += entry.sales || 0;
        totalCGST += entry.cgst || 0;
        totalSGST += entry.sgst || 0;
      });

      const totalTax = totalCGST + totalSGST;
      const totalAmount = totalTaxableAmount + totalTax;

      setEditedData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          taxable_amount: totalTaxableAmount,
          grand_taxable: totalTaxableAmount,
          total_tax: totalTax,
          total_cgst: totalCGST,
          total_sgst: totalSGST,
          grand_cgst: totalCGST,
          grand_sgst: totalSGST,
          final_amount: totalAmount,
          grand_total: totalAmount,
        };
      });
    }
  }, [editedData?.gst_breakdown, isEditMode]);

  // Auto-calculate financial totals when products change in editedData
  // This effect is now handled by the GST breakdown effect above
  // Keeping this for backward compatibility but it should sync with GST breakdown
  React.useEffect(() => {
    if (editedData && editedData.gst_breakdown && editedData.gst_breakdown.length > 0 && isEditMode) {
      // Recalculate totals from GST breakdown to ensure consistency
      let totalTaxableAmount = 0;
      let totalCGST = 0;
      let totalSGST = 0;

      editedData.gst_breakdown.forEach((entry: any) => {
        totalTaxableAmount += Number(entry.sales || 0);
        totalCGST += Number(entry.cgst || 0);
        totalSGST += Number(entry.sgst || 0);
      });

      const totalTax = totalCGST + totalSGST;
      const totalAmount = totalTaxableAmount + totalTax;

      // Only update if values have changed to avoid infinite loops
      const currentTaxable = Number(editedData.taxable_amount || 0);
      const currentCGST = Number(editedData.total_cgst || 0);
      const currentSGST = Number(editedData.total_sgst || 0);
      const currentTotal = Number(editedData.final_amount || 0);

      if (
        Math.abs(currentTaxable - totalTaxableAmount) > 0.01 ||
        Math.abs(currentCGST - totalCGST) > 0.01 ||
        Math.abs(currentSGST - totalSGST) > 0.01 ||
        Math.abs(currentTotal - totalAmount) > 0.01
      ) {
        setEditedData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            taxable_amount: totalTaxableAmount,
            grand_taxable: totalTaxableAmount,
            total_tax: totalTax,
            total_cgst: totalCGST,
            total_sgst: totalSGST,
            grand_cgst: totalCGST,
            grand_sgst: totalSGST,
            final_amount: totalAmount,
            grand_total: totalAmount,
          };
        });
      }
    }
  }, [editedData?.gst_breakdown, isEditMode]);

  // Get current data (edited or original) - use editedData if it exists, otherwise use original
  const getOriginalData = () => ({
    company_name: store?.storename || store?.name || "",
    company_short_name: (store?.storename || store?.name || "").split(" ")[0] || "",
    company_suffix: (store?.storename || store?.name || "").split(" ").slice(1).join(" ") || "",
    company_address: store?.storeaddress || "",
    company_mobile: store?.phone || "",
    company_gstin: store?.gstin || store?.gstNumber || "",
    lut_ref: store?.lutRefNo || "",
    lut_date: store?.lutDate || "",
    invoice_no: billData.billNumber || `INV-${billData.id}`,
    invoice_date: billData.createdAt || "",
    invoice_month: new Date(billData.createdAt || new Date()).toLocaleString('en-US', { month: 'long' }),
    po_no: billData.poNumber || billData.purchaseOrderNumber || "",
    po_date: billData.poDate || "",
    invoice_title: "TAX INVOICE",
    invoice_copy_type: "Original for Recipient",
    billing_name: billData.customerName || billData.billingCompanyName || "",
    billing_address: billData.customerAddress || billData.billingAddress || "",
    billing_mobile: billData.customerPhone || billData.billingPhone || "",
    billing_gstin: billData.billingGSTIN || billData.customerGSTIN || "",
    shipping_name: billData.shippingCompanyName || billData.customerName || "",
    shipping_address: billData.shippingAddress || billData.customerAddress || "",
    bank_account_name: store?.bankAccountName || store?.accountName || store?.storename || "",
    bank_account_number: store?.bankAccountNumber || store?.accountNumber || "",
    bank_ifsc: store?.bankIFSC || store?.ifscCode || "",
    bank_name_branch: store?.bankName || store?.bankNameBranch || "",
    taxable_amount: billData.subtotal || 0,
    total_cgst: 0,
    total_sgst: 0,
    total_tax: billData.tax || 0,
    final_amount: billData.total || 0,
    grand_taxable: billData.subtotal || 0,
    grand_cgst: 0,
    grand_sgst: 0,
    grand_total: billData.total || 0,
    terms_condition_1: "1. Goods once sold cannot be taken back or exchanged.",
    terms_condition_2: `2. Dispute : If any arising from this deal are subject to ${store?.jurisdiction || "Chennai"} Jurisdiction.`,
    products: billData.products || [],
  });

  // Use editedData if it exists (even after saving), otherwise use original
  const currentData = editedData || getOriginalData();

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Reset editedData to null so it reverts to original values
    setEditedData(null);
  };

  const handleSave = async () => {
    if (!editedData || !id) {
      alert("No data to save or bill ID is missing");
      return;
    }

    console.log("editedData34567890", editedData);

    try {
      // Map editedData to API format matching backend controller
      // Backend accepts both snake_case (frontend format) and camelCase (API format)
      // We'll send camelCase (API standard) format
      const updateData: any = {
        id: Number(id),
        // Note: storeId is NOT sent - backend ignores it for security
        
        // Invoice information - camelCase format (API standard)
        invoiceType: billData.invoiceType || "Invoice",
        invoiceFormatId: invoiceFormatId || billData.invoiceFormatId || null,
        invoiceNumber: editedData.invoice_no !== undefined ? editedData.invoice_no : (billData.billNumber || `INV-${id}`),
        invoiceDate: (editedData.invoice_date && editedData.invoice_date !== '')
          ? (typeof editedData.invoice_date === 'string' 
              ? editedData.invoice_date 
              : new Date(editedData.invoice_date).toISOString())
          : (billData.createdAt || null),
        invoiceMonth: editedData.invoice_month || null,
        poNumber: (editedData.po_no && editedData.po_no !== '') 
          ? editedData.po_no 
          : (billData.poNumber || billData.purchaseOrderNumber || ""),
        poDate: (editedData.po_date && editedData.po_date !== '')
          ? (typeof editedData.po_date === 'string' 
              ? editedData.po_date 
              : new Date(editedData.po_date).toISOString())
          : (billData.poDate || null),
        
        // Customer/Billing information - camelCase format
        customerName: editedData.billing_name !== undefined ? editedData.billing_name : (billData.customerName || ""),
        customerEmail: billData.customerEmail || "",
        customerPhone: editedData.billing_mobile !== undefined ? editedData.billing_mobile : (billData.customerPhone || ""),
        billingAddress: editedData.billing_address !== undefined ? editedData.billing_address : (billData.customerAddress || billData.billingAddress || ""),
        billingGSTIN: editedData.billing_gstin !== undefined ? editedData.billing_gstin : (billData.billingGSTIN || billData.customerGSTIN || ""),
        
        // Shipping information - camelCase format
        shippingCompanyName: editedData.shipping_name !== undefined ? editedData.shipping_name : (billData.shippingCompanyName || ""),
        shippingAddress: editedData.shipping_address !== undefined ? editedData.shipping_address : (billData.shippingAddress || ""),
        
        // Company information - camelCase format (if backend supports)
        companyName: editedData.company_name || null,
        companyShortName: editedData.company_short_name || null,
        companySuffix: editedData.company_suffix || null,
        companyAddress: editedData.company_address || null,
        companyMobile: editedData.company_mobile || null,
        companyGSTIN: editedData.company_gstin || null,
        lutRef: editedData.lut_ref || null,
        lutDate: (editedData.lut_date && editedData.lut_date !== '')
          ? (typeof editedData.lut_date === 'string' 
              ? editedData.lut_date 
              : new Date(editedData.lut_date).toISOString())
          : null,
        
        // Bank information - camelCase format (if backend supports)
        bankAccountName: editedData.bank_account_name || null,
        bankAccountNumber: editedData.bank_account_number || null,
        bankIFSC: editedData.bank_ifsc || null,
        bankNameBranch: editedData.bank_name_branch || null,
        
        // Invoice metadata - camelCase format (if backend supports)
        invoiceTitle: editedData.invoice_title || null,
        invoiceCopyType: editedData.invoice_copy_type || null,
        
        // Terms & Conditions - camelCase format (if backend supports)
        termsConditions: editedData.terms_conditions || null,
        
        gstBreakdown: editedData.gst_breakdown ? JSON.stringify(editedData.gst_breakdown) : null,

        // Products - send as array (backend handles conversion to JSON)
        products: Array.isArray(editedData.products) 
          ? editedData.products.map((p: any) => ({
              quantity: p.quantity || 0,
              price: p.price || p.rate || 0,
              total: p.total || (p.quantity || 0) * (p.price || p.rate || 0),
              size: p.size || "",
              weight: p.weight || "",
              name: p.name || p.productName || "",
              photo: p.photo || "",
              hsnSac: p.hsnSac || p.hsn || p.sac || "",
              uom: p.uom || p.unit || "NOS",
              gstRate: p.gstRate || p.gstPercent || 0,
              gstPercent: p.gstRate || p.gstPercent || 0,
            }))
          : (editedData.products || []),
        
        // Financial information - camelCase format, send as strings (backend converts to decimals)
        subtotal: String(editedData.taxable_amount !== undefined ? editedData.taxable_amount : (editedData.grand_taxable !== undefined ? editedData.grand_taxable : (billData.subtotal || 0))),
        discount: String(billData.discount || 0),
        discountPercent: String(billData.discountPercent || 0),
        tax: String(editedData.total_tax !== undefined ? editedData.total_tax : (billData.tax || 0)),
        taxPercent: String(billData.taxPercent || 0),
        total: String(editedData.final_amount !== undefined ? editedData.final_amount : (editedData.grand_total !== undefined ? editedData.grand_total : (billData.total || 0))),
        totalCGST: String(editedData.total_cgst !== undefined ? editedData.total_cgst : (editedData.grand_cgst !== undefined ? editedData.grand_cgst : 0)),
        totalSGST: String(editedData.total_sgst !== undefined ? editedData.total_sgst : (editedData.grand_sgst !== undefined ? editedData.grand_sgst : 0)),
        
        // Notes
        notes: billData.notes || "",
      };

      // Clean up the updateData object
      // Remove fields that are undefined (backend uses undefined to mean "don't update")
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
        // Convert empty strings to null for date fields (backend expects null or Date string)
        if ((key === 'invoiceDate' || key === 'poDate' || key === 'lutDate') && updateData[key] === '') {
          updateData[key] = null;
        }
        // Convert empty strings to null for optional string fields that can be null
        if ((key === 'poNumber' || key === 'invoiceNumber' || key === 'invoiceFormatId') && updateData[key] === '') {
          updateData[key] = null;
        }
        // Remove null values for optional fields that backend doesn't need (cleanup)
        // Keep null for fields that backend explicitly handles (like invoiceFormatId, dates)
        const fieldsToKeepNull = ['invoiceFormatId', 'invoiceDate', 'poDate', 'lutDate', 'invoiceMonth'];
        if (!fieldsToKeepNull.includes(key) && updateData[key] === null) {
          delete updateData[key];
        }
      });

      console.log("updateData being sent to API:", JSON.stringify(updateData, null, 2));

      const result = await updateBill(updateData).unwrap();

      if (result.success) {
        alert("Invoice updated successfully!");
        setIsEditMode(false);
        
        // Update editedData with the API response data (convert camelCase to snake_case)
        if (result.data) {
          const apiData = result.data;
          const updatedEditedData: any = {
            // Company information
            company_name: apiData.companyName || editedData.company_name || "",
            company_short_name: apiData.companyShortName || editedData.company_short_name || "",
            company_suffix: apiData.companySuffix || editedData.company_suffix || "",
            company_address: apiData.companyAddress || editedData.company_address || "",
            company_mobile: apiData.companyMobile || editedData.company_mobile || "",
            company_gstin: apiData.companyGSTIN || editedData.company_gstin || "",
            lut_ref: apiData.lutRef || editedData.lut_ref || "",
            lut_date: apiData.lutDate || editedData.lut_date || "",
            
            // Invoice information
            invoice_no: apiData.invoiceNumber || editedData.invoice_no || "",
            invoice_date: apiData.invoiceDate || editedData.invoice_date || "",
            invoice_month: apiData.invoiceMonth || editedData.invoice_month || "",
            po_no: apiData.poNumber || editedData.po_no || "",
            po_date: apiData.poDate || editedData.po_date || "",
            invoice_title: apiData.invoiceTitle || editedData.invoice_title || "",
            invoice_copy_type: apiData.invoiceCopyType || editedData.invoice_copy_type || "",
            
            // Billing information
            billing_name: apiData.customerName || editedData.billing_name || "",
            billing_address: apiData.billingAddress || editedData.billing_address || "",
            billing_mobile: apiData.customerPhone || editedData.billing_mobile || "",
            billing_gstin: apiData.billingGSTIN || editedData.billing_gstin || "",
            
            // Shipping information
            shipping_name: apiData.shippingCompanyName || editedData.shipping_name || "",
            shipping_address: apiData.shippingAddress || editedData.shipping_address || "",
            
            // Bank details
            bank_account_name: apiData.bankAccountName || editedData.bank_account_name || "",
            bank_account_number: apiData.bankAccountNumber || editedData.bank_account_number || "",
            bank_ifsc: apiData.bankIFSC || editedData.bank_ifsc || "",
            bank_name_branch: apiData.bankNameBranch || editedData.bank_name_branch || "",
            
            // Financial information (keep from editedData as they're calculated)
            taxable_amount: editedData.taxable_amount || 0,
            total_cgst: editedData.total_cgst || 0,
            total_sgst: editedData.total_sgst || 0,
            total_tax: editedData.total_tax || 0,
            final_amount: editedData.final_amount || 0,
            grand_taxable: editedData.grand_taxable || 0,
            grand_cgst: editedData.grand_cgst || 0,
            grand_sgst: editedData.grand_sgst || 0,
            grand_total: editedData.grand_total || 0,
            
            // Terms & Conditions - parse from API response
            terms_conditions: (() => {
              if (apiData.termsConditions) {
                try {
                  if (typeof apiData.termsConditions === 'string') {
                    return JSON.parse(apiData.termsConditions);
                  } else if (Array.isArray(apiData.termsConditions)) {
                    return apiData.termsConditions;
                  }
                } catch (e) {
                  console.warn('[ViewBill] Error parsing termsConditions from response:', e);
                }
              }
              return editedData.terms_conditions || [];
            })(),
            
            // Products - parse from API response
            products: (() => {
              if (apiData.products) {
                try {
                  if (typeof apiData.products === 'string') {
                    return JSON.parse(apiData.products);
                  } else if (Array.isArray(apiData.products)) {
                    return apiData.products;
                  }
                } catch (e) {
                  console.warn('[ViewBill] Error parsing products from response:', e);
                }
              }
              return editedData.products || [];
            })(),
            
            // GST breakdown - parse from API response (gstBreakdown in camelCase)
            gst_breakdown: (() => {
              if (apiData.gstBreakdown) {
                try {
                  if (typeof apiData.gstBreakdown === 'string') {
                    const parsed = JSON.parse(apiData.gstBreakdown);
                    // Ensure it's an array and has the correct structure
                    if (Array.isArray(parsed)) {
                      return parsed;
                    }
                  } else if (Array.isArray(apiData.gstBreakdown)) {
                    return apiData.gstBreakdown;
                  }
                } catch (e) {
                  console.warn('[ViewBill] Error parsing gstBreakdown from response:', e);
                }
              }
              // Fallback to editedData if API doesn't have it
              return editedData.gst_breakdown || [];
            })(),
          };
          
          setEditedData(updatedEditedData);
        }
        
        // Refetch the bill data to get the latest from server
        refetch();
      } else {
        alert(result.message || "Failed to update invoice. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating invoice:", error);
      alert(
        error?.data?.message || 
        error?.message || 
        "Failed to update invoice. Please try again."
      );
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [field]: value,
      });
    }
  };

  // Handle client selection
  const handleClientSelect = (clientId: number | string) => {
    const id = Number(clientId);
    setSelectedClientId(id);
    setSelectedBranchIndex(null); // Reset branch when client changes

    const client = clientsData?.data?.find((c: any) => c.id === id);
    if (client && editedData) {
      // Auto-populate billing name from client
      setEditedData({
        ...editedData,
        billing_name: `${client.firstName || ''} ${client.lastName || ''}`.trim() || client.email || '',
        billing_mobile: client.phone || '',
        billing_gstin: client.gstNumber || '',
      });
    }
  };

  // Handle branch selection
  const handleBranchSelect = (branchIndex: number | string) => {
    if (branchIndex === 'main') {
      setSelectedBranchIndex(null);
      // Use main client address
      if (selectedClient && editedData) {
        setEditedData({
          ...editedData,
          billing_address: selectedClient.address || '',
          billing_mobile: selectedClient.phone || editedData.billing_mobile || '',
        });
      }
    } else {
      const index = Number(branchIndex);
      setSelectedBranchIndex(index);

      if (selectedClient && branches[index] && editedData) {
        const branch = branches[index];
        // Auto-populate billing address from selected branch
        setEditedData({
          ...editedData,
          billing_address: branch.address || '',
          billing_mobile: branch.phone || editedData.billing_mobile || '',
        });
      }
    }
  };

  // Handle Terms & Conditions - add new term
  const handleAddTerm = () => {
    if (editedData) {
      const currentTerms = editedData.terms_conditions || [];
      setEditedData({
        ...editedData,
        terms_conditions: [...currentTerms, { id: Date.now(), text: '' }],
      });
    }
  };

  // Handle Terms & Conditions - remove term
  const handleRemoveTerm = (termId: number) => {
    if (editedData) {
      const currentTerms = editedData.terms_conditions || [];
      setEditedData({
        ...editedData,
        terms_conditions: currentTerms.filter((t: any) => t.id !== termId),
      });
    }
  };

  // Handle Terms & Conditions - update term text
  const handleUpdateTerm = (termId: number, text: string) => {
    if (editedData) {
      const currentTerms = editedData.terms_conditions || [];
      setEditedData({
        ...editedData,
        terms_conditions: currentTerms.map((t: any) =>
          t.id === termId ? { ...t, text } : t
        ),
      });
    }
  };

  // Handle GST Breakdown - add new entry
  const handleAddGSTEntry = () => {
    if (editedData) {
      const currentGST = editedData.gst_breakdown || [];
      const newEntry = {
        id: Date.now(),
        rate: 0,
        sales: 0,
        cgst: 0,
        sgst: 0,
        total: 0,
      };
      setEditedData({
        ...editedData,
        gst_breakdown: [...currentGST, newEntry],
      });
    }
  };

  // Handle GST Breakdown - remove entry
  const handleRemoveGSTEntry = (entryId: number) => {
    if (editedData) {
      const currentGST = editedData.gst_breakdown || [];
      setEditedData({
        ...editedData,
        gst_breakdown: currentGST.filter((entry: any) => entry.id !== entryId),
      });
    }
  };

  // Handle GST Breakdown - update entry
  const handleUpdateGSTEntry = (entryId: number, field: string, value: number) => {
    if (editedData) {
      // Mark that we're manually editing GST to prevent auto-recalculation from products
      isManuallyEditingGST.current = true;
      
      const currentGST = editedData.gst_breakdown || [];
      const updatedGST = currentGST.map((entry: any) => {
        if (entry.id === entryId) {
          const updated = { ...entry, [field]: value };
          // Auto-calculate total if sales, cgst, or sgst changes
          if (field === 'sales' || field === 'cgst' || field === 'sgst') {
            updated.total = (updated.sales || 0) + (updated.cgst || 0) + (updated.sgst || 0);
          }
          // If rate changes, recalculate CGST and SGST from sales
          if (field === 'rate' && updated.sales > 0) {
            const gstRate = updated.rate || 0;
            const cgstPercent = gstRate / 2;
            const sgstPercent = gstRate / 2;
            updated.cgst = (updated.sales * cgstPercent) / 100;
            updated.sgst = (updated.sales * sgstPercent) / 100;
            updated.total = updated.sales + updated.cgst + updated.sgst;
          }
          return updated;
        }
        return entry;
      });
      
      setEditedData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          gst_breakdown: updatedGST,
        };
      });
      
      // Reset the flag after a short delay to allow recalculation from products if needed
      setTimeout(() => {
        isManuallyEditingGST.current = false;
      }, 1000);
    }
  };

  const handleProductEdit = (index: number) => {
    setEditingProductIndex(index);
    onProductModalOpen();
  };

  const handleProductAdd = () => {
    setEditingProductIndex(null); // null means adding new product
    onProductModalOpen();
  };

  const handleProductDelete = (index: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    if (editedData && editedData.products) {
      const updatedProducts = editedData.products.filter((_: any, i: number) => i !== index);
      
      // Recalculate GST breakdown
      const gstCalc = calculateGSTBreakdownFromProducts(updatedProducts);
      const gstRates = [0, 5, 12, 18, 28];
      const gstBreakdown = gstRates.map(rate => ({
        id: rate,
        rate: rate,
        sales: gstCalc.breakdownByRate[rate]?.sales || 0,
        cgst: gstCalc.breakdownByRate[rate]?.cgst || 0,
        sgst: gstCalc.breakdownByRate[rate]?.sgst || 0,
        total: gstCalc.breakdownByRate[rate]?.total || 0,
      }));

      // Update the products hash ref to trigger recalculation
      lastProductsHash.current = JSON.stringify(updatedProducts.map((p: any) => ({
        quantity: p.quantity || 0,
        price: p.price || p.rate || 0,
        gstRate: p.gstRate || p.gstPercent || 0,
        name: p.name || p.productName || '',
      })));

      setEditedData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          products: updatedProducts,
          gst_breakdown: gstBreakdown,
          taxable_amount: gstCalc.taxableAmount,
          grand_taxable: gstCalc.taxableAmount,
          total_tax: gstCalc.totalTax,
          total_cgst: gstCalc.cgst,
          total_sgst: gstCalc.sgst,
          grand_cgst: gstCalc.cgst,
          grand_sgst: gstCalc.sgst,
          final_amount: gstCalc.totalAmount,
          grand_total: gstCalc.totalAmount,
        };
      });
    }
  };

  // Function to calculate GST breakdown automatically
  const calculateGSTBreakdownFromProducts = (products: any[]) => {
    const gstRates = [0, 5, 12, 18, 28];
    const breakdownByRate: Record<number, { sales: number; cgst: number; sgst: number; total: number }> = {};

    gstRates.forEach(rate => {
      breakdownByRate[rate] = { sales: 0, cgst: 0, sgst: 0, total: 0 };
    });

    let totalTaxableAmount = 0;
    let totalCGST = 0;
    let totalSGST = 0;

    products.forEach((product: any) => {
      const quantity = Number(product.quantity || 0);
      // Use rate field if available, otherwise use price - always calculate from unit rate
      const unitRate = Number(product.rate || product.price || 0);
      // Always calculate amount from rate × quantity to ensure accuracy
      const amount = unitRate * quantity;
      const gstRate = Number(product.gstRate || product.gstPercent || 0);
      const cgstPercent = gstRate / 2;
      const sgstPercent = gstRate / 2;
      const cgst = (amount * cgstPercent) / 100;
      const sgst = (amount * sgstPercent) / 100;
      const net = amount + cgst + sgst;

      // Round to nearest GST rate (0, 5, 12, 18, 28)
      const roundedRate = gstRates.reduce((prev, curr) =>
        Math.abs(curr - gstRate) < Math.abs(prev - gstRate) ? curr : prev
      );

      if (breakdownByRate[roundedRate]) {
        breakdownByRate[roundedRate].sales += amount;
        breakdownByRate[roundedRate].cgst += cgst;
        breakdownByRate[roundedRate].sgst += sgst;
        breakdownByRate[roundedRate].total += net;
      }

      totalTaxableAmount += amount;
      totalCGST += cgst;
      totalSGST += sgst;
    });

    const totalTax = totalCGST + totalSGST;
    const totalAmount = totalTaxableAmount + totalTax;

    return {
      breakdownByRate,
      taxableAmount: totalTaxableAmount,
      cgst: totalCGST,
      sgst: totalSGST,
      totalTax,
      totalAmount,
    };
  };

  const handleProductSave = (productData: any) => {
    if (!editedData) return;

    let updatedProducts;
    if (editingProductIndex !== null) {
      // Editing existing product
      updatedProducts = [...editedData.products];
      updatedProducts[editingProductIndex] = { ...updatedProducts[editingProductIndex], ...productData };
    } else {
      // Adding new product
      updatedProducts = [...(editedData.products || []), productData];
    }

    // Automatically recalculate GST breakdown
    const gstCalc = calculateGSTBreakdownFromProducts(updatedProducts);
    const gstRates = [0, 5, 12, 18, 28];
    const gstBreakdown = gstRates.map(rate => ({
      id: rate,
      rate: rate,
      sales: gstCalc.breakdownByRate[rate]?.sales || 0,
      cgst: gstCalc.breakdownByRate[rate]?.cgst || 0,
      sgst: gstCalc.breakdownByRate[rate]?.sgst || 0,
      total: gstCalc.breakdownByRate[rate]?.total || 0,
    }));

    // Update the products hash ref to trigger recalculation
    lastProductsHash.current = JSON.stringify(updatedProducts.map((p: any) => ({
      quantity: p.quantity || 0,
      price: p.price || p.rate || 0,
      gstRate: p.gstRate || p.gstPercent || 0,
      name: p.name || p.productName || '',
    })));

    setEditedData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        products: updatedProducts,
        gst_breakdown: gstBreakdown,
        taxable_amount: gstCalc.taxableAmount,
        grand_taxable: gstCalc.taxableAmount,
        total_tax: gstCalc.totalTax,
        total_cgst: gstCalc.cgst,
        total_sgst: gstCalc.sgst,
        grand_cgst: gstCalc.cgst,
        grand_sgst: gstCalc.sgst,
        final_amount: gstCalc.totalAmount,
        grand_total: gstCalc.totalAmount,
      };
    });
    
    onProductModalClose();
    setEditingProductIndex(null);
  };

  const handleDownload = () => {
    // You can implement PDF download functionality here
    alert("PDF download functionality can be implemented here");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${Number(amount).toFixed(2)}`;
  };

  // Replace template placeholders with actual data
  const renderInvoiceFromTemplate = React.useCallback(() => {
    if (!invoiceFormat) {
      console.log('[ViewBill] No invoice format available');
      return null; // Will fall back to default rendering
    }

    console.log('[ViewBill] Rendering invoice from template:', {
      formatName: invoiceFormat.name,
      hasTemplate: !!invoiceFormat.template,
      hasHeaderTemplate: !!invoiceFormat.headerTemplate,
      hasFooterTemplate: !!invoiceFormat.footerTemplate,
    });

    const template = invoiceFormat.template || "";
    const headerTemplate = invoiceFormat.headerTemplate || "";
    const footerTemplate = invoiceFormat.footerTemplate || "";

    if (!template && !headerTemplate && !footerTemplate) {
      console.warn('[ViewBill] Invoice format has no templates');
      return null;
    }

    // Helper function to convert number to words (Indian numbering system)
    const numberToWords = (num: number): string => {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
      const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

      const convertHundreds = (n: number): string => {
        if (n === 0) return '';
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) {
          const ten = Math.floor(n / 10);
          const one = n % 10;
          return tens[ten] + (one ? ' ' + ones[one] : '');
        }
        const hundred = Math.floor(n / 100);
        const remainder = n % 100;
        return ones[hundred] + ' Hundred' + (remainder ? ' ' + convertHundreds(remainder) : '');
      };

      if (num === 0) return 'Zero';

      const crore = Math.floor(num / 10000000);
      const lakh = Math.floor((num % 10000000) / 100000);
      const thousand = Math.floor((num % 100000) / 1000);
      const remainder = num % 1000;

      let result = '';
      if (crore > 0) result += convertHundreds(crore) + ' Crore ';
      if (lakh > 0) result += convertHundreds(lakh) + ' Lakh ';
      if (thousand > 0) result += convertHundreds(thousand) + ' Thousand ';
      if (remainder > 0) result += convertHundreds(remainder);

      return result.trim();
    };

    // Format amount with paise
    const formatAmountInWords = (amount: number): string => {
      const rupees = Math.floor(amount);
      const paise = Math.round((amount - rupees) * 100);
      let words = numberToWords(rupees);
      if (paise > 0) {
        words += ' And ' + numberToWords(paise) + ' Paise';
      }
      return words + ' Only';
    };

    // Use currentData (edited or original) for replacements
    // But prioritize API response data (billData) when available for saved fields
    const data = currentData;
    
    // Parse termsConditions from API response if it's a JSON string
    let parsedTermsConditions = null;
    if (billData.termsConditions) {
      try {
        if (typeof billData.termsConditions === 'string') {
          parsedTermsConditions = JSON.parse(billData.termsConditions);
        } else if (Array.isArray(billData.termsConditions)) {
          parsedTermsConditions = billData.termsConditions;
        }
      } catch (e) {
        console.warn('[ViewBill] Error parsing termsConditions:', e);
      }
    }

    // Calculate GST breakdown by rate (0%, 5%, 12%, 18%, 28%)
    // Always calculate from products to ensure accuracy, unless manual breakdown has valid totals
    const calculateGSTBreakdown = () => {
      const products = data.products || billData.products || [];
      
      // Check if manual GST breakdown exists and has valid totals (non-zero)
      const hasValidManualBreakdown = data.gst_breakdown && 
        data.gst_breakdown.length > 0 && 
        data.gst_breakdown.some((entry: any) => (entry.sales || 0) > 0 || (entry.total || 0) > 0);
      
      // If manual GST breakdown exists with valid data, use it
      if (hasValidManualBreakdown) {
        const breakdownByRate: Record<number, { sales: number; cgst: number; sgst: number; total: number }> = {};
        let totalTaxableAmount = 0;
        let totalCGST = 0;
        let totalSGST = 0;

        data.gst_breakdown.forEach((entry: any) => {
          const rate = entry.rate || 0;
          breakdownByRate[rate] = {
            sales: entry.sales || 0,
            cgst: entry.cgst || 0,
            sgst: entry.sgst || 0,
            total: entry.total || 0,
          };
          totalTaxableAmount += entry.sales || 0;
          totalCGST += entry.cgst || 0;
          totalSGST += entry.sgst || 0;
        });

        const totalTax = totalCGST + totalSGST;
        const totalAmount = totalTaxableAmount + totalTax;

        return {
          breakdownByRate,
          taxableAmount: totalTaxableAmount,
          cgst: totalCGST,
          sgst: totalSGST,
          totalTax,
          totalAmount,
        };
      }

      // Always calculate from products to ensure accuracy
      const gstRates = [0, 5, 12, 18, 28];

      // Group products by GST rate
      const breakdownByRate: Record<number, { sales: number; cgst: number; sgst: number; total: number }> = {};

      gstRates.forEach(rate => {
        breakdownByRate[rate] = { sales: 0, cgst: 0, sgst: 0, total: 0 };
      });

      let totalTaxableAmount = 0;
      let totalCGST = 0;
      let totalSGST = 0;

      products.forEach((product: any) => {
        const quantity = Number(product.quantity || 0);
        // Use rate field if available, otherwise use price - always calculate from unit rate
        const unitRate = Number(product.rate || product.price || 0);
        // Always calculate amount from rate × quantity to ensure accuracy
        const amount = unitRate * quantity;
        const gstRate = Number(product.gstRate || product.gstPercent || billData.taxPercent || 0);
        const cgstPercent = gstRate / 2;
        const sgstPercent = gstRate / 2;
        const cgst = (amount * cgstPercent) / 100;
        const sgst = (amount * sgstPercent) / 100;
        const net = amount + cgst + sgst;

        // Round to nearest GST rate (0, 5, 12, 18, 28)
        const roundedRate = gstRates.reduce((prev, curr) =>
          Math.abs(curr - gstRate) < Math.abs(prev - gstRate) ? curr : prev
        );

        if (breakdownByRate[roundedRate]) {
          breakdownByRate[roundedRate].sales += amount;
          breakdownByRate[roundedRate].cgst += cgst;
          breakdownByRate[roundedRate].sgst += sgst;
          breakdownByRate[roundedRate].total += net;
        }

        totalTaxableAmount += amount;
        totalCGST += cgst;
        totalSGST += sgst;
      });

      const totalTax = totalCGST + totalSGST;
      const totalAmount = totalTaxableAmount + totalTax;

      return {
        breakdownByRate,
        taxableAmount: totalTaxableAmount,
        cgst: totalCGST,
        sgst: totalSGST,
        totalTax,
        totalAmount,
      };
    };

    const gstBreakdown = calculateGSTBreakdown();
    const totalAmount = gstBreakdown.totalAmount || data.final_amount || billData.total || 0;
    const amountInWords = formatAmountInWords(totalAmount);

    // Get current date components
    const invoiceDate = new Date(data.invoice_date || billData.createdAt || new Date());
    const invoiceMonth = data.invoice_month || invoiceDate.toLocaleString('en-US', { month: 'long' });
    const invoiceYear = invoiceDate.getFullYear();

    // Prepare replacement data
    // Priority: API response (billData) > editedData (currentData) > store data
    const replacements: Record<string, string> = {
      // Store/Company information - new format
      // Use API response fields (camelCase) when available, fallback to editedData (snake_case), then store
      "{{company_name}}": billData.companyName || data.company_name || store?.storename || store?.name || "Store Name",
      "{{company_short_name}}": billData.companyShortName || data.company_short_name || (store?.storename || store?.name || "Store").split(" ")[0] || "Store",
      "{{company_suffix}}": billData.companySuffix || data.company_suffix || (store?.storename || store?.name || "").split(" ").slice(1).join(" ") || "",
      "{{company_logo}}": store?.logo || store?.logoUrl || "https://nicknameinfotech.com/img/new-logo.png",
      "{{company_address}}": billData.companyAddress || data.company_address || store?.storeaddress || "",
      "{{company_mobile}}": billData.companyMobile || data.company_mobile || store?.phone || "",
      "{{company_gstin}}": billData.companyGSTIN || data.company_gstin || store?.gstin || store?.gstNumber || store?.GSTNo || "",
      "{{lut_ref}}": billData.lutRef || data.lut_ref || store?.lutRefNo || "",
      "{{lut_date}}": billData.lutDate ? formatDate(billData.lutDate) : (data.lut_date ? formatDate(data.lut_date) : (store?.lutDate ? formatDate(store.lutDate) : "")),
      "{{invoice_title}}": billData.invoiceTitle || data.invoice_title || "TAX INVOICE",
      "{{invoice_copy_type}}": billData.invoiceCopyType || data.invoice_copy_type || "Original for Recipient",

      // Store information - old format (for backward compatibility)
      "{{storeName}}": store?.storename || store?.name || "Store Name",
      "{{storeNameShort}}": (store?.storename || store?.name || "Store").split(" ")[0] || "Store",
      "{{storeNameSuffix}}": (store?.storename || store?.name || "").split(" ").slice(1).join(" ") || "ENTERPRISES",
      "{{storeLogo}}": store?.logo || store?.logoUrl || "https://nicknameinfotech.com/img/new-logo.png",
      "{{storeAddress}}": store?.storeaddress || "",
      "{{storePhone}}": store?.phone || "",
      "{{storeEmail}}": store?.email || "",
      "{{storeWebsite}}": store?.website || "",
      "{{storeGSTIN}}": store?.gstin || store?.gstNumber || "",
      "{{storePAN}}": store?.pan || store?.panNumber || "",

      // Bill/Invoice information - new format
      // Use API response fields (camelCase) when available
      "{{invoice_no}}": billData.invoiceNumber || data.invoice_no || billData.billNumber || `INV-${billData.id}`,
      "{{invoice_date}}": billData.invoiceDate ? formatDate(billData.invoiceDate) : (data.invoice_date ? formatDate(data.invoice_date) : formatDate(billData.createdAt)),
      "{{invoice_month}}": billData.invoiceMonth || data.invoice_month || invoiceMonth,
      "{{po_no}}": billData.poNumber || data.po_no || billData.purchaseOrderNumber || "",
      "{{po_date}}": billData.poDate ? formatDate(billData.poDate) : (data.po_date ? formatDate(data.po_date) : ""),

      // Bill information - old format (for backward compatibility)
      "{{billNumber}}": billData.billNumber || `INV-${billData.id}`,
      "{{billDate}}": formatDate(billData.createdAt),
      "{{invoiceDate}}": formatDate(billData.createdAt),
      "{{invoiceNumber}}": billData.billNumber || `INV-${billData.id}`,
      "{{poNumber}}": billData.poNumber || billData.purchaseOrderNumber || "",
      "{{poDate}}": billData.poDate ? formatDate(billData.poDate) : "",
      "{{lutRefNo}}": store?.lutRefNo || "",
      "{{lutDate}}": store?.lutDate ? formatDate(store.lutDate) : "",

      // Customer/Billing information - new format
      // Use API response fields (camelCase) when available
      "{{billing_name}}": billData.customerName || data.billing_name || billData.billingCompanyName || "",
      "{{billing_address}}": billData.billingAddress || data.billing_address || billData.customerAddress || "",
      "{{billing_mobile}}": billData.customerPhone || data.billing_mobile || billData.billingPhone || "",
      "{{billing_gstin}}": billData.billingGSTIN || data.billing_gstin || billData.customerGSTIN || "",

      // Customer/Billing information - old format (for backward compatibility)
      "{{customerName}}": billData.customerName || "",
      "{{customerEmail}}": billData.customerEmail || "",
      "{{customerPhone}}": billData.customerPhone || "",
      "{{billingCompanyName}}": billData.customerName || billData.billingCompanyName || "",
      "{{billingAddress}}": billData.customerAddress || billData.billingAddress || "",
      "{{billingPhone}}": billData.customerPhone || billData.billingPhone || "",
      "{{billingGSTIN}}": billData.billingGSTIN || billData.customerGSTIN || "",

      // Shipping information - new format
      // Use API response fields (camelCase) when available
      "{{shipping_name}}": billData.shippingCompanyName || data.shipping_name || billData.customerName || "",
      "{{shipping_address}}": billData.shippingAddress || data.shipping_address || billData.customerAddress || "",

      // Shipping information - old format (for backward compatibility)
      "{{shippingCompanyName}}": billData.shippingCompanyName || billData.customerName || "",
      "{{shippingAddress}}": billData.shippingAddress || billData.customerAddress || "",
      "{{otherRef}}": billData.otherRef || billData.otherReference || "",

      // Products - use GST table for GST format, simple table for others
      // Note: generateGSTProductsTable and generateProductsTable are defined outside this callback
      // They need to be called here, so we'll generate them inline if needed
      "{{products}}": (() => {
        const isGSTFormat = invoiceFormat?.name?.toLowerCase().includes('gst');
        if (isGSTFormat) {
          // Generate GST products table inline
          if (!billData?.products || billData.products.length === 0) {
            return "<p>No products found</p>";
          }
          const productRows = billData.products.map((product: any, index: number) => {
            const productName = product.productName || product.name || `Product ${index + 1}`;
            const hsnSac = product.hsnSac || product.hsn || product.sac || "";
            const uom = product.uom || product.unit || "NOS";
            const quantity = Number(product.quantity || 0);
            // Use rate field if available, otherwise use price - always calculate from unit rate
            const unitRate = Number(product.rate || product.price || 0);
            // Always calculate amount from rate × quantity to ensure accuracy
            const amount = unitRate * quantity;
            const gstRate = Number(product.gstRate || product.gstPercent || billData.taxPercent || 0);
            const cgstPercent = gstRate / 2;
            const sgstPercent = gstRate / 2;
            const cgst = (amount * cgstPercent) / 100;
            const sgst = (amount * sgstPercent) / 100;
            const net = amount + cgst + sgst;
            return `
              <tr>
                <td>${index + 1}</td>
                <td class="text-left">${productName}</td>
                <td>${hsnSac}</td>
                <td>${uom}</td>
                <td>${quantity}</td>
                <td>${unitRate.toFixed(2)}</td>
                <td>${amount.toFixed(2)}</td>
                <td>${cgstPercent.toFixed(1)}</td>
                <td>${cgst.toFixed(2)}</td>
                <td>${sgstPercent.toFixed(1)}</td>
                <td>${sgst.toFixed(2)}</td>
                <td>${net.toFixed(2)}</td>
              </tr>
            `;
          }).join("");
          return `
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
                ${productRows}
              </tbody>
            </table>
          `;
        } else {
          // Generate simple products table
          if (!billData?.products || billData.products.length === 0) {
            return "<p>No products found</p>";
          }
          const productRows = billData.products.map((product: any, index: number) => {
            const productName = product.productName || product.name || `Product ${index + 1}`;
            const size = product.size ? product.size.toUpperCase() : "-";
            const quantity = Number(product.quantity || 0);
            // Use rate field if available, otherwise use price - always calculate from unit rate
            const unitRate = Number(product.rate || product.price || 0);
            // Always calculate total from rate × quantity to ensure accuracy
            const calculatedTotal = unitRate * quantity;
            const unitPrice = formatCurrency(unitRate);
            const total = formatCurrency(calculatedTotal);
            return `
              <tr>
                <td style="padding: 12px; text-align: left; font-size: 12px;">${productName}</td>
                <td style="padding: 12px; text-align: center; font-size: 12px;">${size}</td>
                <td style="padding: 12px; text-align: center; font-size: 12px;">${quantity}</td>
                <td style="padding: 12px; text-align: right; font-size: 12px;">${unitPrice}</td>
                <td style="padding: 12px; text-align: right; font-size: 12px;">${total}</td>
              </tr>
            `;
          }).join("");
          return `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #2563eb; color: white;">
                  <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">ITEM</th>
                  <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold;">SIZE</th>
                  <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold;">QUANTITY</th>
                  <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">UNIT PRICE</th>
                  <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                ${productRows}
              </tbody>
            </table>
          `;
        }
      })(),
      "{{gstProducts}}": (() => {
        if (!billData?.products || billData.products.length === 0) {
          return "<p>No products found</p>";
        }
        const productRows = billData.products.map((product: any, index: number) => {
          const productName = product.productName || product.name || `Product ${index + 1}`;
          const hsnSac = product.hsnSac || product.hsn || product.sac || "";
          const uom = product.uom || product.unit || "NOS";
          const quantity = Number(product.quantity || 0);
          // Use rate field if available, otherwise use price - always calculate from unit rate
          const unitRate = Number(product.rate || product.price || 0);
          // Always calculate amount from rate × quantity to ensure accuracy
          const amount = unitRate * quantity;
          const gstRate = Number(product.gstRate || product.gstPercent || billData.taxPercent || 0);
          const cgstPercent = gstRate / 2;
          const sgstPercent = gstRate / 2;
          const cgst = (amount * cgstPercent) / 100;
          const sgst = (amount * sgstPercent) / 100;
          const net = amount + cgst + sgst;
          return `
            <tr>
              <td>${index + 1}</td>
              <td class="text-left">${productName}</td>
              <td>${hsnSac}</td>
              <td>${uom}</td>
              <td>${quantity}</td>
              <td>${unitRate.toFixed(2)}</td>
              <td>${amount.toFixed(2)}</td>
              <td>${cgstPercent.toFixed(1)}</td>
              <td>${cgst.toFixed(2)}</td>
              <td>${sgstPercent.toFixed(1)}</td>
              <td>${sgst.toFixed(2)}</td>
              <td>${net.toFixed(2)}</td>
            </tr>
          `;
        }).join("");
        return `
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
              ${productRows}
            </tbody>
          </table>
        `;
      })(),

      // Bank details - new format
      // Use API response fields (camelCase) when available
      "{{bank_account_name}}": billData.bankAccountName || data.bank_account_name || store?.bankAccountName || store?.accountName || store?.storename || "",
      "{{bank_account_number}}": billData.bankAccountNumber || data.bank_account_number || store?.bankAccountNumber || store?.accountNumber || "",
      "{{bank_ifsc}}": billData.bankIFSC || data.bank_ifsc || store?.bankIFSC || store?.ifscCode || "",
      "{{bank_name_branch}}": billData.bankNameBranch || data.bank_name_branch || store?.bankName || store?.bankNameBranch || "",

      // Bank details - old format (for backward compatibility)
      "{{bankAccountNumber}}": store?.bankAccountNumber || store?.accountNumber || "",
      "{{bankIFSC}}": store?.bankIFSC || store?.ifscCode || "",
      "{{bankName}}": store?.bankName || store?.bankNameBranch || "",
      "{{bankAccountName}}": store?.bankAccountName || store?.accountName || "",

      // Jurisdiction
      "{{jurisdiction}}": store?.jurisdiction || "Chennai",

      // Financial information - new format
      // Use calculated values from GST breakdown (automatically calculated from products)
      "{{taxable_amount}}": formatCurrency(gstBreakdown.taxableAmount),
      "{{total_cgst}}": formatCurrency(gstBreakdown.cgst),
      "{{total_sgst}}": formatCurrency(gstBreakdown.sgst),
      "{{total_tax}}": formatCurrency(gstBreakdown.totalTax),
      "{{final_amount}}": formatCurrency(gstBreakdown.totalAmount),
      "{{grand_taxable}}": formatCurrency(gstBreakdown.taxableAmount),
      "{{grand_cgst}}": formatCurrency(gstBreakdown.cgst),
      "{{grand_sgst}}": formatCurrency(gstBreakdown.sgst),
      "{{grand_total}}": formatCurrency(gstBreakdown.totalAmount),
      "{{amount_in_words}}": formatAmountInWords(gstBreakdown.totalAmount),
      // Terms & Conditions - use parsed termsConditions from API response when available
      "{{terms_condition_1}}": (() => {
        const terms = parsedTermsConditions || (data.terms_conditions && Array.isArray(data.terms_conditions) ? data.terms_conditions : null);
        if (terms && terms.length > 0) {
          return terms[0]?.text || "1. Goods once sold cannot be taken back or exchanged.";
        }
        return data.terms_condition_1 || "1. Goods once sold cannot be taken back or exchanged.";
      })(),
      "{{terms_condition_2}}": (() => {
        const terms = parsedTermsConditions || (data.terms_conditions && Array.isArray(data.terms_conditions) ? data.terms_conditions : null);
        if (terms && terms.length > 1) {
          return terms[1]?.text || `2. Dispute : If any arising from this deal are subject to ${store?.jurisdiction || "Chennai"} Jurisdiction.`;
        }
        return data.terms_condition_2 || `2. Dispute : If any arising from this deal are subject to ${store?.jurisdiction || "Chennai"} Jurisdiction.`;
      })(),
      "{{terms_conditions}}": (() => {
        const terms = parsedTermsConditions || (data.terms_conditions && Array.isArray(data.terms_conditions) ? data.terms_conditions : null);
        if (terms && terms.length > 0) {
          return terms.map((term: any, index: number) => `${index + 1}. ${term.text || ''}`).join('<br>');
        }
        return (data.terms_condition_1 || '') + '<br>' + (data.terms_condition_2 || '');
      })(),

      // Financial information - old format (for backward compatibility)
      "{{subtotal}}": formatCurrency(billData.subtotal || 0),
      "{{discount}}": formatCurrency(billData.discount || 0),
      "{{discountPercent}}": billData.discountPercent || "0",
      "{{tax}}": formatCurrency(billData.tax || 0),
      "{{taxPercent}}": billData.taxPercent || "0",
      "{{total}}": formatCurrency(billData.total || 0),
      "{{taxableAmount}}": gstBreakdown.taxableAmount.toFixed(2),
      "{{totalCGST}}": gstBreakdown.cgst.toFixed(2),
      "{{totalSGST}}": gstBreakdown.sgst.toFixed(2),
      "{{totalIGST}}": "0.00", // IGST for inter-state transactions
      "{{totalTax}}": gstBreakdown.totalTax.toFixed(2),
      "{{totalAmount}}": gstBreakdown.totalAmount.toFixed(2),
      "{{amountinWords}}": amountInWords,
      "{{amountInWords}}": amountInWords,

      // GST Rate Summary (calculated by rate)
      "{{gst0Sales}}": formatCurrency(gstBreakdown.breakdownByRate[0]?.sales || 0),
      "{{gst0CGST}}": formatCurrency(gstBreakdown.breakdownByRate[0]?.cgst || 0),
      "{{gst0SGST}}": formatCurrency(gstBreakdown.breakdownByRate[0]?.sgst || 0),
      "{{gst0Total}}": formatCurrency(gstBreakdown.breakdownByRate[0]?.total || 0),
      "{{gst5Sales}}": formatCurrency(gstBreakdown.breakdownByRate[5]?.sales || 0),
      "{{gst5CGST}}": formatCurrency(gstBreakdown.breakdownByRate[5]?.cgst || 0),
      "{{gst5SGST}}": formatCurrency(gstBreakdown.breakdownByRate[5]?.sgst || 0),
      "{{gst5Total}}": formatCurrency(gstBreakdown.breakdownByRate[5]?.total || 0),
      "{{gst12Sales}}": formatCurrency(gstBreakdown.breakdownByRate[12]?.sales || 0),
      "{{gst12CGST}}": formatCurrency(gstBreakdown.breakdownByRate[12]?.cgst || 0),
      "{{gst12SGST}}": formatCurrency(gstBreakdown.breakdownByRate[12]?.sgst || 0),
      "{{gst12Total}}": formatCurrency(gstBreakdown.breakdownByRate[12]?.total || 0),
      "{{gst18Sales}}": formatCurrency(gstBreakdown.breakdownByRate[18]?.sales || 0),
      "{{gst18CGST}}": formatCurrency(gstBreakdown.breakdownByRate[18]?.cgst || 0),
      "{{gst18SGST}}": formatCurrency(gstBreakdown.breakdownByRate[18]?.sgst || 0),
      "{{gst18Total}}": formatCurrency(gstBreakdown.breakdownByRate[18]?.total || 0),
      "{{gst28Sales}}": formatCurrency(gstBreakdown.breakdownByRate[28]?.sales || 0),
      "{{gst28CGST}}": formatCurrency(gstBreakdown.breakdownByRate[28]?.cgst || 0),
      "{{gst28SGST}}": formatCurrency(gstBreakdown.breakdownByRate[28]?.sgst || 0),
      "{{gst28Total}}": formatCurrency(gstBreakdown.breakdownByRate[28]?.total || 0),

      // Status
      "{{status}}": "Paid",

      // Notes
      "{{notes}}": billData.notes || "",
    };

    // Replace all placeholders in templates
    let header = headerTemplate;
    let body = template;
    let footer = footerTemplate;

    // Handle Mustache-style loops first
    // Process {{#products}}...{{/products}} loop
    const productsLoopRegex = /\{\{#products\}\}([\s\S]*?)\{\{\/products\}\}/g;
    body = body.replace(productsLoopRegex, (_match, loopContent) => {
      const products = data.products || billData?.products || [];
      if (!products || products.length === 0) {
        return "";
      }

      const productRows = products.map((product: any, index: number) => {
        const productName = product.productName || product.name || `Product ${index + 1}`;
        const hsnSac = product.hsnSac || product.hsn || product.sac || "";
        const uom = product.uom || product.unit || "NOS";
        const quantity = Number(product.quantity || 0);
        // Use rate field if available, otherwise use price - always calculate from unit rate
        const unitRate = Number(product.rate || product.price || 0);
        // Always calculate amount from rate × quantity to ensure accuracy
        const amount = unitRate * quantity;
        const gstRate = Number(product.gstRate || product.gstPercent || billData.taxPercent || 0);
        const cgstPercent = gstRate / 2;
        const sgstPercent = gstRate / 2;
        const cgst = (amount * cgstPercent) / 100;
        const sgst = (amount * sgstPercent) / 100;
        const net = amount + cgst + sgst;

        let row = loopContent;
        row = row.replace(/\{\{sno\}\}/gi, String(index + 1));
        row = row.replace(/\{\{product_name\}\}/gi, productName);
        row = row.replace(/\{\{hsn\}\}/gi, hsnSac);
        row = row.replace(/\{\{uom\}\}/gi, uom);
        row = row.replace(/\{\{qty\}\}/gi, String(quantity));
        row = row.replace(/\{\{rate\}\}/gi, unitRate.toFixed(2));
        row = row.replace(/\{\{amount\}\}/gi, amount.toFixed(2));
        row = row.replace(/\{\{cgst_percent\}\}/gi, cgstPercent.toFixed(1));
        row = row.replace(/\{\{cgst_amount\}\}/gi, cgst.toFixed(2));
        row = row.replace(/\{\{sgst_percent\}\}/gi, sgstPercent.toFixed(1));
        row = row.replace(/\{\{sgst_amount\}\}/gi, sgst.toFixed(2));
        row = row.replace(/\{\{net_amount\}\}/gi, net.toFixed(2));

        return row;
      }).join("");

      return productRows;
    });

    // Process {{#gst_summary}}...{{/gst_summary}} loop
    const gstSummaryLoopRegex = /\{\{#gst_summary\}\}([\s\S]*?)\{\{\/gst_summary\}\}/g;
    body = body.replace(gstSummaryLoopRegex, (_match, loopContent) => {
      // Use manual gst_breakdown if available, otherwise use calculated breakdown
      if (data.gst_breakdown && data.gst_breakdown.length > 0) {
        const gstRows = data.gst_breakdown.map((entry: any) => {
          let row = loopContent;
          row = row.replace(/\{\{gst_label\}\}/gi, `GST ${entry.rate || 0}%`);
          row = row.replace(/\{\{taxable\}\}/gi, formatCurrency(entry.sales || 0));
          row = row.replace(/\{\{cgst\}\}/gi, formatCurrency(entry.cgst || 0));
          row = row.replace(/\{\{sgst\}\}/gi, formatCurrency(entry.sgst || 0));
          row = row.replace(/\{\{total\}\}/gi, formatCurrency(entry.total || 0));
          return row;
        }).join("");
        return gstRows;
      } else {
        // Include all GST rates: 0%, 5%, 12%, 18%, 28%
        const gstRates = [0, 5, 12, 18, 28];
        const gstRows = gstRates.map(rate => {
          const entry = gstBreakdown.breakdownByRate[rate];
          // Show all rates, even if sales is 0
          let row = loopContent;
          row = row.replace(/\{\{gst_label\}\}/gi, `GST ${rate}%`);
          row = row.replace(/\{\{taxable\}\}/gi, formatCurrency(entry.sales));
          row = row.replace(/\{\{cgst\}\}/gi, formatCurrency(entry.cgst));
          row = row.replace(/\{\{sgst\}\}/gi, formatCurrency(entry.sgst));
          row = row.replace(/\{\{total\}\}/gi, formatCurrency(entry.total));

          return row;
        }).join("");

        return gstRows;
      }
    });

    // Replace placeholders - handle case-insensitive matching and multiple passes
    // Do multiple passes to handle nested replacements and ensure all are replaced
    for (let pass = 0; pass < 3; pass++) {
      Object.keys(replacements).forEach((key) => {
        const value = replacements[key] || ""; // Use empty string if value is null/undefined
        // Extract the key name without {{ }}
        const keyName = key.replace(/\{\{|\}\}/g, "").trim();
        // Create regex that matches {{keyName}} case-insensitively, with optional spaces
        const regex = new RegExp(`\\{\\{\\s*${keyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\}\\}`, "gi");

        header = header.replace(regex, value);
        body = body.replace(regex, value);
        footer = footer.replace(regex, value);
      });
    }

    // Check for any remaining placeholders
    const remainingPlaceholders = [
      ...new Set([
        ...(header.match(/\{\{[^}]+\}\}/g) || []),
        ...(body.match(/\{\{[^}]+\}\}/g) || []),
        ...(footer.match(/\{\{[^}]+\}\}/g) || []),
      ])
    ];

    if (remainingPlaceholders.length > 0) {
      console.warn('[ViewBill] Unreplaced placeholders found:', remainingPlaceholders);
      console.log('[ViewBill] Available replacements:', Object.keys(replacements));
    }

    // Debug: Log logo URL replacement
    const logoUrl = replacements["{{storeLogo}}"] || replacements["{{company_logo}}"] || "https://nicknameinfotech.com/img/new-logo.png";
    console.log('[ViewBill] Logo URL:', logoUrl);
    
    // Force replace logo in header, body, and footer with explicit replacement
    const logoPlaceholders = [
      '{{storeLogo}}',
      '{{company_logo}}',
      '{{logo}}',
      '{{companyLogo}}'
    ];
    
    logoPlaceholders.forEach(placeholder => {
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      header = header.replace(regex, logoUrl);
      body = body.replace(regex, logoUrl);
      footer = footer.replace(regex, logoUrl);
    });
    
    // Verify replacement
    if (header.includes('{{storeLogo}}') || header.includes('{{company_logo}}')) {
      console.warn('[ViewBill] Logo placeholder still present after replacement!');
      console.log('[ViewBill] Header snippet:', header.substring(0, 500));
    } else {
      console.log('[ViewBill] Logo URL successfully replaced');
    }

    // Combine header, body, and footer into complete HTML document
    let fullHtml = "";
    if (headerTemplate || template || footerTemplate) {
      // If we have headerTemplate, it likely contains <!DOCTYPE>, <html>, <head>, and opening <body>
      // If we have footerTemplate, it likely contains closing </body> and </html>
      // Combine them properly
      if (headerTemplate && footerTemplate) {
        // Header already has opening body tag, footer has closing body/html tags
        // Insert template content between header and footer
        fullHtml = header + body + footer;
      } else if (headerTemplate) {
        // Only header exists, append body and close tags
        fullHtml = header + body + "\n</body>\n</html>";
      } else if (footerTemplate) {
        // Only footer exists, prepend opening tags
        fullHtml = "<!DOCTYPE html>\n<html lang=\"en\">\n<head><meta charset=\"UTF-8\"><title>Invoice</title></head>\n<body>\n" + body + footer;
      } else {
        // Only template exists, wrap it in basic HTML structure
        fullHtml = body;
      }
    } else {
      fullHtml = body;
    }

    return { body, fullHtml };
  }, [invoiceFormat, billData, store, currentData]);

  const templateContent = renderInvoiceFromTemplate();
  const useTemplate = !!invoiceFormat && !!templateContent && (
    (templateContent.fullHtml && templateContent.fullHtml.length > 0) ||
    (templateContent.body && templateContent.body.length > 0)
  );


  return (
    <div className="mx-2 my-4 print:mx-0 print:my-0 print:p-0">
      {/* Action Buttons - Hidden in Print */}
      <div className="flex justify-between items-center mb-4 print:hidden">
        <Button
          color="default"
          onClick={() => navigate("/Billing/List")}
          variant="flat"
        >
          ← Back to Bills
        </Button>
        {invoiceFormatId ? <div className="flex gap-2">
          {!isEditMode ? (
            <>
              <Button color="secondary" onClick={handleEdit} variant="flat">
                Edit Invoice
              </Button>
              <Button color="primary" onClick={handlePrint} variant="flat">
                Print Invoice
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="danger" 
                onClick={handleCancel} 
                variant="flat"
                isDisabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                color="success" 
                onClick={handleSave} 
                variant="flat"
                isLoading={isUpdating}
                isDisabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div> : <Button color="primary" onClick={handlePrint} variant="flat">
          Print Invoice
        </Button>}
      </div>

      {/* Edit Mode UI */}
      {isEditMode && editedData && (
        <Card className="mb-4 print:hidden">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Company Information */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Company Information</h3>
                <Input
                  label="Company Name"
                  value={editedData.company_name}
                  onChange={(e) => handleFieldChange('company_name', e.target.value)}
                />
                <Input
                  label="Company Short Name"
                  value={editedData.company_short_name}
                  onChange={(e) => handleFieldChange('company_short_name', e.target.value)}
                />
                <Input
                  label="Company Suffix"
                  value={editedData.company_suffix}
                  onChange={(e) => handleFieldChange('company_suffix', e.target.value)}
                />
                <Textarea
                  label="Company Address"
                  value={editedData.company_address}
                  onChange={(e) => handleFieldChange('company_address', e.target.value)}
                />
                <Input
                  label="Mobile"
                  value={editedData.company_mobile}
                  onChange={(e) => handleFieldChange('company_mobile', e.target.value)}
                />
                <Input
                  label="GSTIN"
                  value={editedData.company_gstin}
                  onChange={(e) => handleFieldChange('company_gstin', e.target.value)}
                />
                <Input
                  label="LUT Ref No"
                  value={editedData.lut_ref}
                  onChange={(e) => handleFieldChange('lut_ref', e.target.value)}
                />
                <Input
                  label="LUT Date"
                  type="date"
                  value={editedData.lut_date ? new Date(editedData.lut_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('lut_date', e.target.value)}
                />
              </div>

              {/* Invoice Information */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Invoice Information</h3>
                <Input
                  label="Invoice Number"
                  value={editedData.invoice_no}
                  onChange={(e) => handleFieldChange('invoice_no', e.target.value)}
                />
                <Input
                  label="Invoice Date"
                  type="date"
                  value={editedData.invoice_date ? new Date(editedData.invoice_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('invoice_date', e.target.value)}
                />
                <Input
                  label="Invoice Month"
                  value={editedData.invoice_month}
                  onChange={(e) => handleFieldChange('invoice_month', e.target.value)}
                />
                <Input
                  label="PO Number"
                  value={editedData.po_no}
                  onChange={(e) => handleFieldChange('po_no', e.target.value)}
                />
                <Input
                  label="PO Date"
                  type="date"
                  value={editedData.po_date ? new Date(editedData.po_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('po_date', e.target.value)}
                />
                <Input
                  label="Invoice Title"
                  value={editedData.invoice_title}
                  onChange={(e) => handleFieldChange('invoice_title', e.target.value)}
                />
                <Input
                  label="Copy Type"
                  value={editedData.invoice_copy_type}
                  onChange={(e) => handleFieldChange('invoice_copy_type', e.target.value)}
                />
              </div>

              {/* Billing Information */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Billing Information</h3>

                {/* Client Selection */}
                <Select
                  label="Select Client"
                  placeholder="Choose a client"
                  selectedKeys={selectedClientId ? new Set([String(selectedClientId)]) : new Set()}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    if (selectedKey && selectedKey !== "0") {
                      handleClientSelect(Number(selectedKey));
                    }
                  }}
                >
                  <SelectItem key="0" value="0">Select Client</SelectItem>
                  {clientsData?.data?.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {`${client.firstName || ''} ${client.lastName || ''}`.trim() || client.email}
                    </SelectItem>
                  ))}
                </Select>

                {/* Branch Selection */}
                {selectedClient && branches.length > 0 && (
                  <Select
                    label="Select Branch"
                    placeholder="Choose a branch"
                    selectedKeys={selectedBranchIndex !== null ? new Set([String(selectedBranchIndex)]) : new Set()}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      if (selectedKey !== undefined) {
                        handleBranchSelect(Number(selectedKey));
                      }
                    }}
                  >
                    <SelectItem key="main" value="main">Main Address</SelectItem>
                    {branches.map((branch: any, index: number) => (
                      <SelectItem key={index} value={index}>
                        {branch.name || `Branch ${index + 1}`}
                      </SelectItem>
                    ))}
                  </Select>
                )}

                <Input
                  label="Billing Name"
                  value={editedData.billing_name}
                  onChange={(e) => handleFieldChange('billing_name', e.target.value)}
                />
                <Textarea
                  label="Billing Address"
                  value={editedData.billing_address}
                  onChange={(e) => handleFieldChange('billing_address', e.target.value)}
                />
                <Input
                  label="Billing Mobile"
                  value={editedData.billing_mobile}
                  onChange={(e) => handleFieldChange('billing_mobile', e.target.value)}
                />
                <Input
                  label="Billing GSTIN"
                  value={editedData.billing_gstin}
                  onChange={(e) => handleFieldChange('billing_gstin', e.target.value)}
                />
              </div>

              {/* Shipping Information */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Shipping Information</h3>
                <Input
                  label="Shipping Name"
                  value={editedData.shipping_name}
                  onChange={(e) => handleFieldChange('shipping_name', e.target.value)}
                />
                <Textarea
                  label="Shipping Address"
                  value={editedData.shipping_address}
                  onChange={(e) => handleFieldChange('shipping_address', e.target.value)}
                />
              </div>

              {/* Bank Details */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Bank Details</h3>
                <Input
                  label="Account Name"
                  value={editedData.bank_account_name}
                  onChange={(e) => handleFieldChange('bank_account_name', e.target.value)}
                />
                <Input
                  label="Account Number"
                  value={editedData.bank_account_number}
                  onChange={(e) => handleFieldChange('bank_account_number', e.target.value)}
                />
                <Input
                  label="IFSC Code"
                  value={editedData.bank_ifsc}
                  onChange={(e) => handleFieldChange('bank_ifsc', e.target.value)}
                />
                <Input
                  label="Bank Name & Branch"
                  value={editedData.bank_name_branch}
                  onChange={(e) => handleFieldChange('bank_name_branch', e.target.value)}
                />
              </div>

              {/* Financial Information - Auto Calculated */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Financial Information (Auto Calculated)</h3>
                {(() => {
                  const gstCalc = calculateGSTBreakdownFromProducts(editedData.products || []);
                  return (
                    <>
                      <Input
                        label="Taxable Amount"
                        type="number"
                        value={String(gstCalc.taxableAmount.toFixed(2))}
                        isReadOnly
                        description="Calculated from products"
                      />
                      <Input
                        label="Total CGST"
                        type="number"
                        value={String(gstCalc.cgst.toFixed(2))}
                        isReadOnly
                        description="Calculated from products"
                      />
                      <Input
                        label="Total SGST"
                        type="number"
                        value={String(gstCalc.sgst.toFixed(2))}
                        isReadOnly
                        description="Calculated from products"
                      />
                      <Input
                        label="Total Tax"
                        type="number"
                        value={String(gstCalc.totalTax.toFixed(2))}
                        isReadOnly
                        description="Calculated from products"
                      />
                      <Input
                        label="Final Amount"
                        type="number"
                        value={String(gstCalc.totalAmount.toFixed(2))}
                        isReadOnly
                        description="Calculated from products"
                      />
                      <Input
                        label="Grand Taxable"
                        type="number"
                        value={String(gstCalc.taxableAmount.toFixed(2))}
                        isReadOnly
                        description="Calculated from products"
                      />
                      <Input
                        label="Grand CGST"
                        type="number"
                        value={String(gstCalc.cgst.toFixed(2))}
                        isReadOnly
                        description="Calculated from products"
                      />
                      <Input
                        label="Grand SGST"
                        type="number"
                        value={String(gstCalc.sgst.toFixed(2))}
                        isReadOnly
                        description="Calculated from products"
                      />
                      <Input
                        label="Grand Total"
                        type="number"
                        value={String(gstCalc.totalAmount.toFixed(2))}
                        isReadOnly
                        description="Calculated from products"
                      />
                      {/* GST Breakdown by Rate - Editable */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">GST Breakdown by Rate:</h4>
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onClick={handleAddGSTEntry}
                          >
                            + Add GST Entry
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(editedData.gst_breakdown || []).map((entry: any) => (
                            <div key={entry.id} className="p-3 border rounded-lg space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">GST {entry.rate}%</span>
                                <Button
                                  size="sm"
                                  color="danger"
                                  variant="light"
                                  onClick={() => handleRemoveGSTEntry(entry.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  label="Sales"
                                  type="number"
                                  size="sm"
                                  value={String(entry.sales || 0)}
                                  onChange={(e) => handleUpdateGSTEntry(entry.id, 'sales', Number(e.target.value))}
                                />
                                <Input
                                  label="CGST"
                                  type="number"
                                  size="sm"
                                  value={String(entry.cgst || 0)}
                                  onChange={(e) => handleUpdateGSTEntry(entry.id, 'cgst', Number(e.target.value))}
                                />
                                <Input
                                  label="SGST"
                                  type="number"
                                  size="sm"
                                  value={String(entry.sgst || 0)}
                                  onChange={(e) => handleUpdateGSTEntry(entry.id, 'sgst', Number(e.target.value))}
                                />
                                <Input
                                  label="Total"
                                  type="number"
                                  size="sm"
                                  value={String(entry.total || 0)}
                                  isReadOnly
                                  description="Auto-calculated"
                                />
                              </div>
                              <Input
                                label="GST Rate %"
                                type="number"
                                size="sm"
                                value={String(entry.rate || 0)}
                                onChange={(e) => handleUpdateGSTEntry(entry.id, 'rate', Number(e.target.value))}
                              />
                            </div>
                          ))}
                          {(!editedData.gst_breakdown || editedData.gst_breakdown.length === 0) && (
                            <p className="text-sm text-default-500">No GST entries. Click "Add GST Entry" to add one.</p>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Terms & Conditions</h3>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onClick={handleAddTerm}
                  >
                    + Add Term
                  </Button>
                </div>
                {(editedData.terms_conditions || []).map((term: any, index: number) => (
                  <div key={term.id || index} className="flex gap-2 items-start">
                    <Textarea
                      label={`Term ${index + 1}`}
                      value={term.text || ''}
                      onChange={(e) => handleUpdateTerm(term.id, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onClick={() => handleRemoveTerm(term.id)}
                      className="mt-6"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {(!editedData.terms_conditions || editedData.terms_conditions.length === 0) && (
                  <p className="text-sm text-default-500">No terms added. Click "Add Term" to add one.</p>
                )}
              </div>

              {/* Products */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Products</h3>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onClick={handleProductAdd}
                  >
                    + Add Product
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableColumn>S No</TableColumn>
                    <TableColumn>Product Name</TableColumn>
                    <TableColumn>HSN/SAC</TableColumn>
                    <TableColumn>UOM</TableColumn>
                    <TableColumn>Qty</TableColumn>
                    <TableColumn>Rate</TableColumn>
                    <TableColumn>GST %</TableColumn>
                    <TableColumn>Actions</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {(editedData.products || []).map((product: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{product.productName || product.name || `Product ${index + 1}`}</TableCell>
                        <TableCell>{product.hsnSac || product.hsn || product.sac || ""}</TableCell>
                        <TableCell>{product.uom || product.unit || "NOS"}</TableCell>
                        <TableCell>{product.quantity || 0}</TableCell>
                        <TableCell>{Number(product.price || 0).toFixed(2)}</TableCell>
                        <TableCell>{product.gstRate || product.gstPercent || 0}%</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onClick={() => handleProductEdit(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              onClick={() => handleProductDelete(index)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Product Add/Edit Modal */}
      <Modal isOpen={isProductModalOpen} onClose={onProductModalClose} size="2xl">
        <ModalContent>
          {(onClose) => {
            const product = editingProductIndex !== null && editedData ? editedData.products[editingProductIndex] : null;
            const isAdding = editingProductIndex === null;

            return (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleProductSave({
                  productName: formData.get('productName')?.toString() || product?.productName || product?.name || "",
                  name: formData.get('productName')?.toString() || product?.productName || product?.name || "",
                  hsnSac: formData.get('hsnSac')?.toString() || product?.hsnSac || product?.hsn || product?.sac || "",
                  hsn: formData.get('hsnSac')?.toString() || product?.hsnSac || product?.hsn || product?.sac || "",
                  uom: formData.get('uom')?.toString() || product?.uom || product?.unit || "NOS",
                  unit: formData.get('uom')?.toString() || product?.uom || product?.unit || "NOS",
                  quantity: Number(formData.get('quantity')) || product?.quantity || 0,
                  price: Number(formData.get('price')) || product?.price || 0,
                  gstRate: Number(formData.get('gstRate')) || product?.gstRate || product?.gstPercent || 0,
                  gstPercent: Number(formData.get('gstRate')) || product?.gstRate || product?.gstPercent || 0,
                });
              }}>
                <ModalHeader>{isAdding ? "Add Product" : "Edit Product"}</ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <Input
                      name="productName"
                      label="Product Name"
                      defaultValue={product?.productName || product?.name || ""}
                      isRequired
                    />
                    <Input
                      name="hsnSac"
                      label="HSN/SAC"
                      defaultValue={product?.hsnSac || product?.hsn || product?.sac || ""}
                    />
                    <Input
                      name="uom"
                      label="UOM"
                      defaultValue={product?.uom || product?.unit || "NOS"}
                    />
                    <Input
                      name="quantity"
                      label="Quantity"
                      type="number"
                      defaultValue={String(product?.quantity || 0)}
                      isRequired
                    />
                    <Input
                      name="price"
                      label="Rate"
                      type="number"
                      step="0.01"
                      defaultValue={String(product?.price || 0)}
                      isRequired
                    />
                    <Input
                      name="gstRate"
                      label="GST %"
                      type="number"
                      step="0.1"
                      defaultValue={String(product?.gstRate || product?.gstPercent || 0)}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    {isAdding ? "Add" : "Save"}
                  </Button>
                </ModalFooter>
              </form>
            );
          }}
        </ModalContent>
      </Modal>

      {/* Loading State */}
      {isLoadingFormat && (
        <div className="flex justify-center items-center py-8">
          <Spinner size="lg" />
        </div>
      )}

      {/* Invoice Container */}
      <div className="print:shadow-none print:border-0 print-only">
        <div className="p-8 print:p-0 print:m-0">
          {useTemplate && templateContent ? (
            /* Render Invoice from Template */
            <div className="invoice-template print:p-0 print:m-0" style={{ width: '100%' }}>
              {/* Full HTML Document (header + body + footer) or Body Template */}
              {templateContent.fullHtml && templateContent.fullHtml.trim().length > 0 ? (
                <div
                  className="print:p-0 print:m-0"
                  dangerouslySetInnerHTML={{ __html: templateContent.fullHtml }}
                />
              ) : templateContent.body && templateContent.body.trim().length > 0 ? (
                <div
                  className="print:p-0 print:m-0"
                  dangerouslySetInnerHTML={{ __html: templateContent.body }}
                />
              ) : null}
            </div>
          ) : (
            /* Default Invoice Rendering (Fallback) */
            <>
              {/* Invoice Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">
                    INVOICE
                  </h1>
                  <p className="text-default-500 text-sm">
                    Invoice #: {billData.billNumber || `INV-${billData.id}`}
                  </p>
                  <p className="text-default-500 text-sm">
                    Date: {formatDate(billData.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold mb-2">
                    {store?.storename || "Store Name"}
                  </h2>
                  <p className="text-sm text-default-600">
                    {store?.storeaddress && (
                      <>
                        {store.storeaddress}
                        <br />
                      </>
                    )}
                    {store?.phone && (
                      <>
                        Phone: {store.phone}
                        <br />
                      </>
                    )}
                    {store?.email && (
                      <>
                        Email: {store.email}
                        <br />
                      </>
                    )}
                    {store?.website && (
                      <>
                        Website: {store.website}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <Divider className="my-6" />

              {/* Bill To Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-default-700">
                    Bill To:
                  </h3>
                  <div className="bg-default-50 dark:bg-default-100 p-4 rounded-lg">
                    <p className="font-semibold text-lg">{billData.customerName}</p>
                    {billData.customerEmail && (
                      <p className="text-sm text-default-600 mt-1">
                        {billData.customerEmail}
                      </p>
                    )}
                    {billData.customerPhone && (
                      <p className="text-sm text-default-600">
                        {billData.customerPhone}
                      </p>
                    )}
                    {billData.customerAddress && (
                      <p className="text-sm text-default-600 mt-2">
                        {billData.customerAddress}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-default-700">
                    Invoice Details:
                  </h3>
                  <div className="bg-default-50 dark:bg-default-100 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-default-600">Invoice Number:</span>
                      <span className="font-semibold">
                        {billData.billNumber || `INV-${billData.id}`}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-default-600">Invoice Date:</span>
                      <span className="font-semibold">
                        {formatDate(billData.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-default-600">Status:</span>
                      <span className="font-semibold text-success">Paid</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="mb-6">
                <Table
                  aria-label="Invoice items table"
                  removeWrapper
                  classNames={{
                    th: "bg-default-100 font-semibold",
                  }}
                >
                  <TableHeader>
                    <TableColumn>ITEM</TableColumn>
                    <TableColumn className="text-center">SIZE</TableColumn>
                    <TableColumn className="text-center">QUANTITY</TableColumn>
                    <TableColumn className="text-right">UNIT PRICE</TableColumn>
                    <TableColumn className="text-right">TOTAL</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {billData?.products && billData.products.length > 0 ? (
                      billData.products.map((product: any, index: number) => (
                        <TableRow key={product.id || index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {product.photo && (
                                <Image
                                  src={`${product.photo}`}
                                  alt={product.productName || product.name || `Product ${index + 1}`}
                                  width={20}
                                  height={10}
                                  className="rounded object-contain"
                                />
                              )}
                              <div>
                                <p className="font-medium">
                                  {product.productName || product.name || `Product ${index + 1}`}
                                </p>
                                {product.productId && (
                                  <p className="text-xs text-default-500">
                                    SKU: {product.productId}
                                  </p>
                                )}
                                {product.weight && (
                                  <p className="text-xs text-default-500">
                                    Weight: {product.weight}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {product.size ? (
                              <span className="px-2 py-1 bg-default-100 rounded text-xs font-medium">
                                {product.size.toUpperCase()}
                              </span>
                            ) : (
                              <span className="text-default-400 text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {product.quantity || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(product.price || 0)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(product.total || 0)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end mb-6">
                <div className="w-full md:w-96">
                  <div className="space-y-3">
                    <div className="flex justify-between text-default-600">
                      <span>Subtotal:</span>
                      <span className="font-medium">
                        {formatCurrency(billData.subtotal || 0)}
                      </span>
                    </div>
                    {(billData.discount || 0) > 0 && (
                      <div className="flex justify-between text-default-600">
                        <span>Discount:</span>
                        <span className="font-medium text-danger">
                          -{formatCurrency(billData.discount || 0)}
                        </span>
                      </div>
                    )}
                    {(billData.tax || 0) > 0 && (
                      <div className="flex justify-between text-default-600">
                        <span>Tax:</span>
                        <span className="font-medium">
                          {formatCurrency(billData.tax || 0)}
                        </span>
                      </div>
                    )}
                    <Divider />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary">
                        {formatCurrency(billData.total || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {billData.notes && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-2 text-default-700">
                    Notes:
                  </h3>
                  <p className="text-default-600 whitespace-pre-line">
                    {billData.notes}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t text-center text-sm text-default-500 print:mt-6">
                <p>Thank you for your business!</p>
                <p className="mt-2">
                  This is a computer-generated invoice and does not require a
                  signature.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
      margin: 5mm; 
      size: A4;
    }

    /* Force white background and hide non-print elements */
    html, body {
      background: #ffffff !important;
      background-color: #ffffff !important;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

          body * {
            visibility: hidden;
          }

          .print-only,
          .print-only * {
            visibility: visible;
          }

          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important; /* Ensures the invoice area is white */
    }

    /* REMOVE UI BORDERS, SHADOWS, AND BACKGROUNDS */
    .print-only [class*="Card"],
    .print-only [class*="card"],
    .print-only [class*="Paper"],
    .print-only [class*="card-body"],
    .print-only [class*="border"],
    .print-only div {
      border: none !important;
      border-width: 0 !important;
            box-shadow: none !important;
      outline: none !important;
      background: transparent !important;
    }

    /* RE-ESTABLISH INVOICE BORDERS ONLY */
    /* This targets the black grid lines seen in the images */
    .invoice-container,
    .invoice-box,
    .invoice-box table,
    .invoice-box td,
    .invoice-box th,
    .invoice-box div[style*="border"],
    .invoice-box .address-table td,
    .invoice-box .product-table th,
    .invoice-box .product-table td,
    .invoice-box .footer-flex,
    .invoice-box .nested-table td,
    .invoice-box .terms-box, {
      border: 1px solid #000000 !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    /* Remove the grey header background if you want it pure white */
    .tax-invoice-bar, 
    .product-table th, 
    .nested-table tr:first-child td {
      background: #ffffff !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewBill;

