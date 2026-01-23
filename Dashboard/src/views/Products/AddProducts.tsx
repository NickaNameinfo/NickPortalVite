import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteItem,
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  RadioGroup,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import React, { createContext } from "react";
import {
  useAddProductMutation,
  useAddStoreProductMutation,
  useAddVendorProductMutation,
  useGetProductsByIdQuery,
  useUpdateProductMutation,
  useUploadProductPhotosMutation,
} from "./Service.mjs";
import { useUploadFileMutation } from "../../Service.mjs"
import { useGetCategoriesQuery } from "../Categories/Service.mjs";
import { getCookie } from "../.././JsFiles//CommonFunction.mjs";
import InputNextUI from "../../Components/Common/Input/input";
import { useGetVendorsProductByIdQuery } from "../VendorProducts/Service.mjs";
import { useGetStoresProductByIDQuery } from "../Store/Service.mjs";
import { SubscriptionExpiredModal } from "../../Components/SubscriptionExpiredModal";
import { CustomRadio } from "../../Components/CustomRadio";
import CategoryModal from "../../Components/CategoryModal";
import JsBarcode from "jsbarcode";
import { useGetStoresByIDQuery } from "../Store/Service.mjs";
import { useAppSelector } from "../../Common/hooks";

const AddProducts = () => {
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const currentStoreUserId = getCookie("storeId");
  const currentVendorUserId = getCookie("vendorId");
  const navigate = useNavigate();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = React.useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = React.useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [barcodeCount, setBarcodeCount] = React.useState<number>(1);
  const [enableSizeManagement, setEnableSizeManagement] = React.useState<boolean>(false);
  const [sizeUnitSizeMap, setSizeUnitSizeMap] = React.useState<Record<string, { unitSize: string; qty: string; price: string; discount: string; discountPer: string; total: string; grandTotal: string }>>({});
  const [sizeEntries, setSizeEntries] = React.useState<Array<{ size: string; unitSize: string; qty: string; price: string; discount: string; discountPer: string; total: string; grandTotal: string; id: string }>>([]);
  const [newSize, setNewSize] = React.useState<string>("");
  const [newUnitSize, setNewUnitSize] = React.useState<string>("");
  const [newPrice, setNewPrice] = React.useState<string>("");
  const [newDiscount, setNewDiscount] = React.useState<string>("");
  const [customSizes, setCustomSizes] = React.useState<string[]>([]);
  const sizeInputRef = React.useRef<string>(""); // Ref to preserve value during blur

  // Base size options for autocomplete
  const baseSizeOptions = React.useMemo(() => [
    "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95",
    "xs", "s", "m", "l", "xl", "2lx", "3lx", "4lx", "5lx", "6lx", "7lx", "8lx", "9lx", "10lx"
  ], []);

  // Helper function to check if a size exists (case-insensitive)
  const sizeExists = React.useCallback((size: string, sizeList: string[]) => {
    const normalizedSize = size.trim().toLowerCase();
    return sizeList.some(s => s.trim().toLowerCase() === normalizedSize);
  }, []);

  // Combined size options (base + custom sizes)
  const sizeOptions = React.useMemo(() => {
    const combined = [...baseSizeOptions];
    // Add custom sizes that aren't already in the base list
    customSizes.forEach(customSize => {
      const trimmed = customSize.trim();
      if (trimmed && 
          !sizeExists(trimmed, baseSizeOptions) && 
          !sizeExists(trimmed, combined)) {
        combined.push(trimmed);
      }
    });
    // Sort: numbers first, then letters, then custom sizes
    return combined.sort((a, b) => {
      const aNum = !isNaN(Number(a));
      const bNum = !isNaN(Number(b));
      if (aNum && !bNum) return -1;
      if (!aNum && bNum) return 1;
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [baseSizeOptions, customSizes, sizeExists]);
  const [addProducts] = useAddProductMutation();
  const [addStoreProducts] = useAddStoreProductMutation();
  const [addVendorProducts] = useAddVendorProductMutation();
  const [updateProducts] = useUpdateProductMutation();
  const [uploadfile] = useUploadFileMutation();
  const [uploadProductPhotos] = useUploadProductPhotosMutation();
  const { productId } = useParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = React.useState<string>("No file selected (file size exceeds 500KB)");
  const [subImages, setSubImages] = React.useState<Array<{ file: File; preview: string }>>([]); // Array of sub-image files with previews
  const [existingSubImages, setExistingSubImages] = React.useState<string[]>([]); // Existing sub-image URLs from API
  let tempFormData = watch();
  const { data: storeData, error: storeError, refetch: storeRefetch } = useGetStoresByIDQuery(
    Number(currentStoreUserId), { skip: !currentStoreUserId }
  );

  const currentloginDetails = useAppSelector(
    (state) => state.globalConfig.currentloginDetails
  );
  const {
    data: categoryData,
    error: categoryerror,
    refetch: categoryrefetch,
  } = useGetCategoriesQuery();

  let currentUserId = currentStoreUserId
    ? currentStoreUserId
    : currentVendorUserId;

  // Get subscription data from currentloginDetails
  const ecommerceSubscription = React.useMemo(() => {
    return currentloginDetails?.data?.subscriptions?.find(
      (sub: any) => sub.subscriptionType === "Plan1" && sub.status === "1"
    );
  }, [currentloginDetails]);

  const customizeSubscription = React.useMemo(() => {
    return currentloginDetails?.data?.subscriptions?.find(
      (sub: any) => sub.subscriptionType === "Plan2" && sub.status === "1"
    );
  }, [currentloginDetails]);

  const bookingSubscription = React.useMemo(() => {
    return currentloginDetails?.data?.subscriptions?.find(
      (sub: any) => sub.subscriptionType === "Plan3" && sub.status === "1"
    );
  }, [currentloginDetails]);

  const {
    data: vendorProducts,
    error: vendorError,
    refetch: vendorRefetch,
  } = useGetVendorsProductByIdQuery(Number(currentVendorUserId), { skip: !currentVendorUserId, refetchOnMountOrArgChange: true });

  const {
    data: storeProducts,
    error: storeProductsError,
    refetch: stroeRefetch,
  } = useGetStoresProductByIDQuery(Number(currentStoreUserId), { skip: !currentStoreUserId, refetchOnMountOrArgChange: true });

  const {
    data: productData,
    error: productError,
    refetch: productRefetch,
  } = useGetProductsByIdQuery(productId, { skip: !productId, refetchOnMountOrArgChange: true });

  React.useEffect(() => {
    setValue("paymentMode", ["1", "2", "3"]);
  }, []);


  React.useEffect(() => {
    if (!productId) {
      reset({
        categoryId: "",
        name: "",
        description: "",
        price: "",
        discount: "",
        qty: "",
        total: "",
        discountPer: "",
        grand_total: "",
        paymentMode: ["1", "2", "3"],
        isEnableCustomize: false,
        isEnableEcommerce: false,
        serviceType: "Product",
        size: "",
        weight: "",
        unitSize: "",
      });
      // Reset size entries when creating new product
      setSizeEntries([]);
      setSizeUnitSizeMap({});
      setNewSize("");
      setNewUnitSize("");
      setNewPrice("");
      // Reset sub-images
      setSubImages([]);
      setExistingSubImages([]);
    }

  }, [productId, reset]);


  React.useEffect(() => {
    if (productData?.data) {
      reset(productData?.data);
      setValue("grand_total", productData?.data?.total);
      setValue("paymentMode", productData?.data?.paymentMode?.split(","));
      setValue("isEnableCustomize", productData?.data?.isEnableCustomize);
      setValue("isEnableEcommerce", productData?.data?.isEnableEcommerce);
      setValue("serviceType", productData?.data?.serviceType);
      setValue("categoryId", productData?.data?.categoryId);
      setValue("size", productData?.data?.size || "");
      setValue("weight", productData?.data?.weight || "");
      setValue("unitSize", productData?.data?.unitSize || "");
      // Reset file name when editing
      setSelectedFileName(productData?.data?.photo ? "Current photo (click to change)" : "No file selected");
      // Load existing sub-images if they exist (from API)
      // Check productphotos (lowercase array from API), productPhotos (camelCase), and subImages for backward compatibility
      let existingPhotos: string[] = [];
      
      // Check productphotos array (from API response - lowercase)
      if (productData?.data?.productphotos && Array.isArray(productData.data.productphotos)) {
        existingPhotos = productData.data.productphotos
          .map((photo: any) => photo?.imgUrl || photo?.url || photo)
          .filter((url: any) => url && typeof url === 'string');
      }
      
      // Fallback to productPhotos or subImages if productphotos not found
      if (existingPhotos.length === 0) {
        const subImagesData = productData?.data?.productPhotos || productData?.data?.subImages;
        if (subImagesData) {
          try {
            const parsed = typeof subImagesData === 'string'
              ? JSON.parse(subImagesData)
              : subImagesData;
            if (Array.isArray(parsed)) {
              existingPhotos = parsed.map((item: any) => {
                // Handle both string URLs and objects with imgUrl
                return typeof item === 'string' ? item : (item?.imgUrl || item?.url || item);
              }).filter((url: any) => url && typeof url === 'string');
            }
          } catch (e) {
            console.error("Error parsing productPhotos/subImages:", e);
          }
        }
      }
      
      setExistingSubImages(existingPhotos);
      // Reset new sub-images when editing
      setSubImages([]);
      // Check if size management is enabled (has sizeUnitSizeMap with multiple entries)
      if (productData?.data?.sizeUnitSizeMap) {
        try {
          const parsed = typeof productData.data.sizeUnitSizeMap === 'string'
            ? JSON.parse(productData.data.sizeUnitSizeMap)
            : productData.data.sizeUnitSizeMap;
          const entriesCount = Object.keys(parsed || {}).length;
          setEnableSizeManagement(entriesCount > 0);
          setSizeUnitSizeMap(parsed || {});
          // Convert map to array of entries
          const entries = Object.entries(parsed || {}).map(([size, data], index) => {
            let entryData: { unitSize?: string; qty?: string; price?: string; discount?: string; discountPer?: string; total?: string; grandTotal?: string };
            if (typeof data === 'object' && data !== null && 'unitSize' in data) {
              entryData = data as { unitSize: string; qty?: string; price: string; discount?: string; discountPer?: string; total?: string; grandTotal?: string };
            } else {
              entryData = { unitSize: String(data || ''), qty: String(data || ''), price: '', discount: '', discountPer: '', total: '', grandTotal: '' };
            }
            // Calculate values if not present
            const price = Number(entryData.price || 0);
            const discount = Number(entryData.discount || 0);
            const discountAmount = (price * discount) / 100;
            const discountedPrice = price - discountAmount;
            const qty = Number(entryData.qty || entryData.unitSize || 0);
            const total = discountedPrice * qty;

            return {
              size,
              unitSize: String(entryData.unitSize || ''),
              qty: String(entryData.qty || entryData.unitSize || ''),
              price: String(entryData.price || ''),
              discount: String(entryData.discount || '0'),
              discountPer: String(entryData.discountPer || discountAmount.toFixed(2)),
              total: String(entryData.total || total.toFixed(2)),
              grandTotal: String(entryData.grandTotal || total.toFixed(2)),
              id: `size-${index}-${Date.now()}`
            };
          });
          setSizeEntries(entries);
        } catch (e) {
          setSizeUnitSizeMap({});
          setSizeEntries([]);
          setEnableSizeManagement(false);
        }
      } else {
        setEnableSizeManagement(false);
        setSizeEntries([]);
      }
    }
  }, [productData]);

  React.useEffect(() => {
    // Only calculate if size management is NOT enabled
    if (!enableSizeManagement) {
      const discountAmount = (tempFormData?.price * tempFormData?.discount) / 100;
      const discountedPrice = tempFormData?.price - discountAmount;
      if (tempFormData.serviceType === "Product") {
        setValue("grand_total", Number(discountedPrice * tempFormData?.qty));
        setValue("total", Number(discountedPrice * tempFormData?.qty));
      } else {
        setValue("grand_total", Number(discountedPrice * 1));
        setValue("total", Number(discountedPrice * 1));
      }
      setValue("discountPer", Number(discountAmount));
    }
  }, [tempFormData?.price, tempFormData?.discount, tempFormData?.qty, tempFormData?.serviceType, enableSizeManagement, setValue]);

  let productListValues =
    vendorProducts?.data?.length > 0
      ? vendorProducts?.data
      : storeProducts?.data;

  const filteredEcommereceData = productListValues?.filter(
    (item) => item.product.isEnableEcommerce === "1"
  );
  const filteredCustomizeData = productListValues?.filter(
    (item) => item.product.isEnableCustomize === 1
  );
  // const productAddCount = sellingProductValuesData?.data?.subscriptionCount + sellingProductValuesData?.data?.freeCount

  console.log(subImages, "subImages24534532");

  
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const formData = new FormData();
    // if ( productAddCount <= productListValues?.length && !productId) {
    //   setIsSubscriptionModalOpen(true)
    //   return;
    // }

    // Only append file if it exists
    if (data.photo) {
      formData.append("file", data.photo);
    }
    formData.append("storeName", currentStoreUserId ? currentStoreUserId : currentVendorUserId);
    if (!data.photo) {
      alert("Please select image");
      setIsLoading(false);
      return;
    }
    let fileResult = await uploadfile(formData);
    console.log("Main image upload response:", fileResult);
    if (!fileResult?.data?.success && !productId) {
      setIsLoading(false);
      return;
    }

    // Upload sub-images if any are selected
    const uploadedSubImageUrls: string[] = [];
    
    // Keep existing sub-images if editing (only if they haven't been removed)
    if (productId && existingSubImages.length > 0) {
      uploadedSubImageUrls.push(...existingSubImages);
    }
    

    // Upload new sub-images
    if (subImages.length > 0) {
      console.log(`Starting upload of ${subImages.length} sub-images...`);
      for (const subImage of subImages) {
        const subFormData = new FormData();
        subFormData.append("file", subImage.file);
        subFormData.append("storeName", currentStoreUserId ? currentStoreUserId : currentVendorUserId);
        
        try {
          // Use same pattern as main image upload (without .unwrap() first, then check structure)
          const subFileResult = await uploadfile(subFormData);
          console.log("Sub-image upload response (raw):", subFileResult);
          
          // Match the main image response structure: fileResult?.data?.fileUrl
          // Also check if it's already unwrapped
          const responseData = subFileResult?.data || subFileResult;
          const fileUrl = responseData?.fileUrl || responseData?.data?.fileUrl;
          const isSuccess = responseData?.success || subFileResult?.data?.success;
          
          console.log("Extracted fileUrl:", fileUrl, "isSuccess:", isSuccess);
          
          if (isSuccess && fileUrl) {
            console.log("Adding file URL to array:", fileUrl);
            uploadedSubImageUrls.push(fileUrl);
          } else {
            console.warn("Upload response missing fileUrl or success flag. Response:", subFileResult);
          }
        } catch (error) {
          console.error("Error uploading sub-image:", error);
          // Continue with other uploads even if one fails
        }
      }
    }
    
    console.log("Final uploadedSubImageUrls:", uploadedSubImageUrls);

    // Calculate total unitSize from all size entries if size management is enabled, or use default unitSize
    let unitSizeForSize: string;
    let defaultPrice: string;

    if (enableSizeManagement && sizeEntries.length > 0) {
      const totalUnitSize = sizeEntries.reduce((sum, entry) => {
        return sum + (Number(entry.unitSize) || 0);
      }, 0);
      unitSizeForSize = totalUnitSize > 0 ? String(totalUnitSize) : (tempFormData?.unitSize || "");
      defaultPrice = sizeEntries[0].price || (tempFormData?.price || "");
    } else {
      // Use existing single fields
      unitSizeForSize = tempFormData?.unitSize || "";
      defaultPrice = tempFormData?.price || "";
    }

    let apiParams = {
      ...data,
      subCategoryId: 3,
      childCategoryId: 3,
      slug: `${new Date().getTime()}`,
      createdId: currentStoreUserId ? currentStoreUserId : currentVendorUserId,
      createdType: currentStoreUserId ? "Store" : "Vendor",
      paymentMode: String(tempFormData?.paymentMode || ""),
      isEnableCustomize: Number(tempFormData?.isEnableCustomize) ? "1" : "0",
      isEnableEcommerce: Number(tempFormData?.isEnableEcommerce) ? "1" : "0",
      isBooking: bookingSubscription ? "1" : "0",
      photo: fileResult?.data?.fileUrl,
      // Note: productPhotos are now handled separately via /upload-photos endpoint
      serviceType: tempFormData?.serviceType || "Product",
      unitSize: unitSizeForSize,
      qty : tempFormData?.qty || "0",
      total : tempFormData?.total || "0",
      price: defaultPrice || tempFormData?.price || "",
      sizeUnitSizeMap: enableSizeManagement ? JSON.stringify(sizeUnitSizeMap) : "", // Store the size-unitSize-price mapping only if enabled
    };
    if (!productId) {
      const result = await addProducts(apiParams).unwrap();
      if (result?.success) {
        const newProductId = result.data?.id;
        
        // Use unitSize from the selected size, or fallback to qty
        const storeUnitSize = unitSizeForSize || result.data?.qty;
        const tempStoreValueAPI = {
          supplierId: currentStoreUserId
            ? currentStoreUserId
            : currentVendorUserId,
          productId: newProductId,
          unitSize: storeUnitSize,
          buyerPrice: result.data?.total,
        };
        
        let storeResult;
        if (currentStoreUserId) {
          storeResult = await addStoreProducts(tempStoreValueAPI).unwrap();
        } else {
          storeResult = await addVendorProducts(tempStoreValueAPI).unwrap();
        }
        
        if (storeResult && newProductId) {
          // Upload product photos using the new /upload-photos endpoint
          if (uploadedSubImageUrls.length > 0) {
            try {
              const photoUploadResult = await uploadProductPhotos({
                productId: newProductId,
                productPhotos: uploadedSubImageUrls, // Send as array (backend accepts array or JSON string)
              }).unwrap();
              console.log("Product photos uploaded successfully:", photoUploadResult);
            } catch (photoError: any) {
              console.error("Error uploading product photos:", photoError);
              // Don't block navigation if photo upload fails
              alert(photoError?.data?.message || "Product created but failed to upload some photos. Please try again.");
            }
          }
          
          navigate("/ProductsList");
          setIsLoading(false);
        }
      }
    } else {
      setValue("id", productData?.data?.id);
      const result = await updateProducts(apiParams).unwrap();
      const updatedProductId = apiParams?.id || productData?.data?.id;
      
      // Use unitSize from the selected size, or fallback to qty
      const storeUnitSize = unitSizeForSize || apiParams?.qty;
      const storeResult = await addStoreProducts({
        supplierId: currentStoreUserId
          ? currentStoreUserId
          : currentVendorUserId,
        productId: updatedProductId,
        unitSize: storeUnitSize,
        buyerPrice: apiParams?.total,
      }).unwrap();
      
      if (storeResult && updatedProductId) {
        // Upload product photos using the new /upload-photos endpoint
        if (uploadedSubImageUrls.length > 0) {
          try {
            const photoUploadResult = await uploadProductPhotos({
              productId: updatedProductId,
              productPhotos: uploadedSubImageUrls, // Send as array (backend accepts array or JSON string)
            }).unwrap();
            console.log("Product photos uploaded successfully:", photoUploadResult);
          } catch (photoError: any) {
            console.error("Error uploading product photos:", photoError);
            // Don't block navigation if photo upload fails
            alert(photoError?.data?.message || "Product updated but failed to upload some photos. Please try again.");
          }
        }
        
        navigate("/ProductsList");
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  const handlePrintBarcode = (count: number) => {
    if (!productId || !productData?.data) return;
    
    const productIdStr = String(productId);
    const productName = productData.data.name || "Product";
    const productColor = productData.data.color || "N/A";
    const currentStoreName = storeData?.data?.storeName || storeData?.data?.storename || "STORE";
    const gstNumber = storeData?.data?.GSTNo || storeData?.data?.gstNo || "";
    
    // Determine if we should use sizeEntries or single product data
    const useSizeEntries = enableSizeManagement && sizeEntries.length > 0;
    const entriesToPrint = useSizeEntries ? sizeEntries : [{
      size: productData.data.size || "N/A",
      price: productData.data.price || productData.data.total || "0",
      unitSize: productData.data.unitSize || String(count),
      id: productIdStr
    }];
    
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups to print barcodes');
      return;
    }

    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Barcode Print</title>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.12.1/dist/JsBarcode.all.min.js"></script>
          <style>
            @media print {
              @page {
                margin: 0;
                size: 50mm 25mm;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .label-container {
                page-break-inside: avoid;
                page-break-after: always;
                width: 50mm;
                height: 25mm;
                margin: 0;
                padding: 1.5mm;
                border: none;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
                position: relative;
                background: white;
              }
              .label-container:first-child {
                page-break-before: auto;
              }
              .label-container:not(:first-child) {
                page-break-before: always;
              }
              .barcode-section {
                page-break-inside: avoid;
                break-inside: avoid;
                flex: 1;
              }
              .label-footer {
                display: flex !important;
                visibility: visible !important;
                align-items: flex-end !important;
                margin-top: auto !important;
              }
              .footer-value {
                display: block !important;
                visibility: visible !important;
              }
              .gst-section {
                display: block !important;
                visibility: visible !important;
                text-align: center !important;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 0;
              margin: 0;
              background: white;
            }
            .barcode-section-wrapper {
              display: block;
              width: 100%;
            }
            .label-container {
              width: 50mm;
              height: 25mm;
              border: none;
              margin: 0;
              padding: 1.5mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-sizing: border-box;
              position: relative;
              background: white;
            }
            .label-header {
              display: flex;
              justify-content: center;
              align-items: flex-start;
              margin-bottom: 0.5mm;
              flex-shrink: 0;
            }
            .label-left {
              text-align: center;
            }
            .label-right {
              text-align: right;
            }
            .label-title {
              font-size: 7px;
              font-weight: bold;
              line-height: 1.1;
              margin: 0;
            }
            .label-number {
              font-size: 6px;
              font-weight: normal;
              margin-top: 0.5px;
            }
            .barcode-section {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 1mm 0;
              padding: 0.5mm 0;
              flex: 1;
              min-height: 9mm;
            }
            .side-number {
              writing-mode: vertical-rl;
              text-orientation: mixed;
              font-size: 7px;
              font-weight: bold;
              padding: 0 1px;
              height: 10mm;
              display: flex;
              align-items: center;
            }
            .side-number-left {
              transform: rotate(180deg);
            }
            .barcode-wrapper {
              width: 80%;
              max-width: 80%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .barcode-value {
              font-size: 6px;
              font-weight: bold;
              margin-top: 0.5px;
              letter-spacing: 0.3px;
            }
            .product-code {
              font-size: 5px;
              margin-top: 0.5px;
              font-weight: normal;
            }
            .label-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: auto;
              margin-bottom: 0.5mm;
              padding-bottom: 0;
              font-size: 7px;
              line-height: 1.2;
              flex-shrink: 0;
            }
            .gst-section {
              text-align: center;
              font-size: 6px;
              font-weight: bold;
              margin-top: 0;
              margin-bottom: 0;
              padding: 0;
              flex-shrink: 0;
            }
            .footer-column {
              flex: 1;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .footer-label {
              font-weight: bold;
              font-size: 6px;
              margin-bottom: 0.5px;
              white-space: nowrap;
            }
            .footer-value {
              font-size: 7px;
              font-weight: normal;
              white-space: nowrap;
            }
            canvas {
              width: 100%;
              max-width: 100%;
              height: auto;
              max-height: 9mm;
              image-rendering: crisp-edges;
            }
          </style>
        </head>
        <body>
          <div class="barcode-section-wrapper">
    `;

    // Generate labels - if sizeEntries exist, create labels for each size
    const labelsToGenerate: Array<{ size: string; price: string; unitSize: string; productId: string }> = [];
    
    if (useSizeEntries) {
      // For each size entry, generate labels based on unitSize (count) multiplied by count input
      entriesToPrint.forEach((entry) => {
        const unitSizeCount = Number(entry.unitSize) || 1;
        const labelsPerSize = count * unitSizeCount; // Count input * unitSize = total labels for this size
        for (let j = 0; j < labelsPerSize; j++) {
          labelsToGenerate.push({
            size: entry.size.toUpperCase(),
            price: entry.price,
            unitSize: entry.unitSize,
            productId: productIdStr
          });
        }
      });
    } else {
      // Single product - generate labels based on count
      for (let i = 0; i < count; i++) {
        labelsToGenerate.push({
          size: entriesToPrint[0].size.toUpperCase(),
          price: entriesToPrint[0].price,
          unitSize: entriesToPrint[0].unitSize || String(count),
          productId: productIdStr
        });
      }
    }

    // Generate HTML for all labels
    labelsToGenerate.forEach((label, i) => {
      const leftSideNumber = label.productId.slice(-4) || "0000";
      const rightSideNumber = label.productId.padStart(8, '0') || "00000000";
      
      htmlContent += `
        <div class="label-container">
          <div class="label-header">
            <div class="label-left">
              <div class="label-title">${currentStoreName}</div>
              <div class="label-number">${label.productId}</div>
            </div>
          </div>
          <div class="barcode-section">
            <div class="barcode-wrapper">
              <canvas id="barcode-${i}"></canvas>
              <div class="barcode-value">${label.productId}</div>
            </div>
          </div>
          <div class="label-footer">
            <div class="footer-column">
              <div class="footer-label">M.R.P. ₹ :-</div>
              <div class="footer-value">${Math.round(Number(label.price))}</div>
            </div>
            <div class="footer-column">
              <div class="footer-label">SIZE</div>
              <div class="footer-value">${label.size}</div>
            </div>
          </div>
          <div class="gst-section">GST: ${gstNumber || 'N/A'}</div>
        </div>
      `;
    });

    htmlContent += `
          </div>
          <script>
            window.onload = function() {
              const labels = ${JSON.stringify(labelsToGenerate)};
              labels.forEach(function(label, i) {
                const canvas = document.getElementById("barcode-" + i);
                if (canvas && typeof JsBarcode !== 'undefined') {
                  try {
                    JsBarcode(canvas, label.productId, {
                      format: "CODE128",
                      width: 1,
                      height: 30,
                      displayValue: false,
                      margin: 2,
                      background: "#ffffff",
                      lineColor: "#000000",
                    });
                  } catch (error) {
                    console.error("Error generating barcode:", error);
                  }
                }
              });
              setTimeout(function() {
                window.print();
              }, 800);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="mx-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between border-b pb-3 mt-2  mb-4">
          <Chip
            size="lg"
            classNames={{
              // "border-1",
              base: "bg-gradient-to-br  border-small border-white/60 ",
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
                  fill="green"
                />
              </svg>
            }
            variant="faded"
            color="default"
          >
            <p className="font-medium  text-black/70">
              {productData?.data ? "Update Product" : "Add Protuct"}
            </p>
          </Chip>
          <div className="text-center">
            <Chip variant="flat" color="primary">
              Total Ecommerce Subscription
            </Chip>
            <p className="mt-2">Total : <Chip variant="flat" color="success" size="sm">
              {(() => {
                const ecommerceSubscription = currentloginDetails?.data?.subscriptions?.find(
                  (sub: any) => sub.subscriptionType === "Plan1" && sub.status === "1"
                );
                return ecommerceSubscription?.subscriptionCount ?? 0;
              })()}
            </Chip> Used : <Chip variant="flat" color="danger" size="sm">{filteredEcommereceData?.length ?? 0}</Chip></p>
          </div>
          <div className="text-center">
            <Chip variant="flat" color="danger">
              Total Customize Subscription
            </Chip>
            <p className="mt-2">Total : <Chip variant="flat" color="success" size="sm">
              {(() => {
                const customizeSubscription = currentloginDetails?.data?.subscriptions?.find(
                  (sub: any) => sub.subscriptionType === "Plan2" && sub.status === "1"
                );
                return customizeSubscription?.subscriptionCount ?? 0;
              })()}
            </Chip> Used : <Chip variant="flat" color="danger" size="sm">{filteredCustomizeData?.length ?? 0}</Chip></p>
          </div>
          {/* <div className="text-center">
            <Chip variant="flat" color="warning">
              Total Selling Products Subscription
            </Chip>
            <p className="mt-2">Total : <Chip variant="flat" color="success" size="sm">{productAddCount ?? 0}</Chip> Used : <Chip variant="flat" color="danger" size="sm">{productListValues?.length ?? 0}</Chip></p>
          </div> */}
          <div className="text-center flex gap-2">
            <Button
              color="primary"
              type="submit"
              size="md"
              isLoading={isLoading}
              isDisabled={isLoading}
            // className="w-[90px]"
            >
              {isLoading ? "...Updating" : productId ? "Update Product" : "Add Product"}
            </Button>
            {productId && (
              <div className="flex items-center gap-2">
                <Button
                  color="secondary"
                  size="md"
                  onClick={() => setIsBarcodeModalOpen(true)}
                >
                  Print Barcode
                </Button>
                {(() => {
                  // Find subscription matching PL1_005 and Plan1
                  const matchingSubscription = currentloginDetails?.data?.subscriptions?.find(
                    (sub: any) => 
                      sub.subscriptionPlan === "PL1_005" && 
                      sub.subscriptionType === "Plan1" &&
                      sub.status === "1"
                  );
                  
                  return matchingSubscription ? (
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      color="primary"
                      className="text-xs"
                    >
                      Plan: {matchingSubscription.subscriptionPlan} 
                      ({matchingSubscription.subscriptionCount} items)
                    </Chip>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-4">
            <Controller
              name="serviceType" // Changed to reflect a text input
              control={control}
              rules={{ required: "Please select value" }}
              render={({ field }) => (
                <RadioGroup label="Type of Product or Service" {...field} orientation="horizontal" className="w-full">
                  <CustomRadio description="Sell physical or digital products directly through your online platform" value="Product">
                    Online selling product
                  </CustomRadio>
                  <CustomRadio description="Offer a range of services, such as consulting, training, or support" value="Service">
                    Providing service
                  </CustomRadio>
                </RadioGroup>
              )}
            />
          </div>
          {
            tempFormData?.serviceType === "Service" ?
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Controller
                      name="categoryId" // Changed to reflect a text input
                      control={control}
                      rules={{ required: "Please select value" }}
                      render={({ field }) => (
                        <Autocomplete
                          isInvalid={errors?.["categoryId"] ? true : false}
                          color={errors?.["categoryId"] ? "danger" : "default"}
                          listboxProps={{
                            itemClasses: {
                              base: [
                                "rounded-md",
                                "text-default-500",
                                "transition-opacity",
                                "data-[hover=true]:text-foreground",
                                "data-[hover=true]:bg-default-100",
                                "dark:data-[hover=true]:bg-default-50",
                                "data-[selectable=true]:focus:bg-default-50",
                                "data-[pressed=true]:opacity-90",
                                "data-[focus-visible=true]:ring-default-500",
                                "shadow-none",
                                // "border-1",
                              ],
                            },
                          }}
                          label="Select Category"
                          variant="faded"
                          size="sm"
                          onSelectionChange={(selectedKey) => {
                            const valueToSave = selectedKey === null ? null : Number(selectedKey);
                            field.onChange(valueToSave); // Updates the form state
                          }}
                          selectedKey={String(tempFormData?.categoryId)}
                        >
                          {categoryData?.data?.map((item) => (
                            <AutocompleteItem key={String(item.id)} value={String(item.id)}>
                              {item.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      )}
                    />
                  </div>
                  <Button
                    color="success"
                    variant="flat"
                    size="sm"
                    onPress={() => setIsCategoryModalOpen(true)}
                  >
                    + Add
                  </Button>
                </div>
                <Controller
                  name="status" // Changed to reflect a text input
                  control={control}
                  rules={{ required: "Please select value" }}
                  render={({ field }) => (
                    <Select
                      classNames={{
                        label: "group-data-[filled=true]:-translate-y-3",
                        trigger: [
                          "bg-transparent",
                          "border-1",
                          "text-default-500",
                          "transition-opacity",
                          "data-[hover=true]:bg-transparent",
                          "data-[hover=true]:bg-transparent",
                          "dark:data-[hover=true]:bg-transparent",
                          "data-[selectable=true]:focus:bg-transparent",
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
                            "dark:data-[hover=true]:bg-default-50",
                            "data-[selectable=true]:focus:bg-default-50",
                            "data-[pressed=true]:opacity-90",
                            "data-[focus-visible=true]:ring-default-500",
                            "shadow-none",
                            // "border-1",
                          ],
                        },
                      }}
                      label="Status"
                      variant="bordered"
                      size="sm"
                      selectedKeys={String(tempFormData?.status)}
                      {...field}
                      isRequired={true}
                      isInvalid={errors?.["status"] ? true : false}
                      errorMessage={errors?.["status"]?.message}
                    >
                      <SelectItem key={1} value={"1"}>
                        {"Active"}
                      </SelectItem>
                      <SelectItem key={0} value={"0"}>
                        {"InActive"}
                      </SelectItem>
                    </Select>
                  )}
                />
                <Controller
                  name="name" // Changed to reflect a text input
                  control={control}
                  rules={{ required: "Please enter value" }}
                  render={({ field }) => (
                    <InputNextUI
                      type="text"
                      label="Service Name"
                      {...field}
                      isRequired={true}
                      isInvalid={errors?.["ServiceName"] ? true : false}
                      errorMessage={errors?.["ServiceName"]?.message}
                    />
                  )}
                />
                <Controller
                  name="sortDesc" // Changed to reflect a text input
                  control={control}
                  rules={{ required: "Please enter value" }}
                  render={({ field }) => (
                    <InputNextUI
                      type="text"
                      label="Sort Description"
                      {...field}
                      isRequired={true}
                      isInvalid={errors?.["sortDesc"] ? true : false}
                      errorMessage={errors?.["sortDesc"]?.message}
                    />
                  )}
                />
                <Controller
                  name="price" // Changed to reflect a text input
                  control={control}
                  rules={{ required: "Please enter value" }}
                  render={({ field }) => (
                    <InputNextUI
                      type="text"
                      label="Price"
                      onChange={(value) => {
                        setValue("grand_total", value);
                      }}
                      {...field}
                      isRequired={true}
                      isInvalid={errors?.["price"] ? true : false}
                      errorMessage={errors?.["price"]?.message}
                    />
                  )}
                />
                <Controller
                  name="discount" // Changed to reflect a text input
                  control={control}
                  rules={{ required: "Please enter value" }}
                  render={({ field }) => (
                    <InputNextUI
                      type="text"
                      label="Discoint(%)"
                      {...field}
                      isRequired={true}
                      isInvalid={errors?.["discount"] ? true : false}
                      errorMessage={errors?.["discount"]?.message}
                    />
                  )}
                />
                <Controller
                  name="discountPer" // Changed to reflect a text input
                  control={control}
                  rules={{ required: "Please enter value" }}
                  render={({ field }) => (
                    <InputNextUI
                      type="text"
                      label="Discount Price"
                      {...field}
                      isDisabled
                      isRequired={true}
                      isInvalid={errors?.["discountPer"] ? true : false}
                      errorMessage={errors?.["discountPer"]?.message}
                    />
                  )}
                />
                <Controller
                  name="total" // Changed to reflect a text input
                  control={control}
                  render={({ field }) => (
                    <InputNextUI
                      type="text"
                      label="Total"
                      onChange={(value) => {
                        console.log(value, "ownername");
                      }}
                      isDisabled
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="grand_total" // Changed to reflect a text input
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <InputNextUI
                      type="text"
                      label="Grant total"
                      isDisabled
                      {...field}
                      errorMessage={errors?.["grand_total"]?.message}
                    />
                  )}
                />

                <div className="flex flex-col gap-4">
                  <div className="flex">
                    <Controller
                      name="photo" // Changed to reflect a text input
                      control={control}
                      render={({ field }) => (
                        <div style={{ position: "relative", width: "100%" }}>
                          <input
                            type="file"
                            id="file"
                            style={{
                              opacity: 0,
                              position: "absolute",
                              zIndex: -1,
                              width: "100%",
                            }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file && file.size > 500 * 1024) { // 500KB limit
                                alert("File size exceeds 500KB. Please select a smaller file.");
                                e.target.value = ''; // Clear the input
                                document.getElementById("fileLabel").innerText = "No file selected";
                              } else {
                                field.onChange(file); // Update form state with selected file
                                document.getElementById("fileLabel").innerText = file
                                  ? file.name
                                  : "No file selected"; // Update label dynamically
                              }
                            }}
                          />
                          <label
                            htmlFor="file"
                            style={{
                              border: "1px solid rgba(128, 128, 128, 0.3)",
                              borderRadius: "7px",
                              padding: "10px",
                              width: "100%",
                              display: "inline-block",
                              textAlign: "center",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            Choose Main Image
                          </label>
                          <span
                            id="fileLabel"
                            style={{
                              marginLeft: "10px",
                              textAlign: "start",
                              fontSize: "12px",
                            }}
                          >
                            No file selected
                          </span>
                        </div>
                      )}
                    />
                    {/* {productData?.data?.photo && ( */}
                    <Image
                      src={`${productData?.data?.photo}`}
                      className="h-20 ml-2"
                      width={100}
                    />
                    {/* )} */}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <Controller
                    name="paymentMode" // Changed to reflect a text input
                    control={control}
                    rules={{ required: "Please enter value" }}
                    render={({ field }) => (
                      <CheckboxGroup
                        label="Select Payment Type"
                        orientation="horizontal"
                        color="secondary"
                        {...field}
                        defaultValue={["1", "2", "3"]}
                      >
                        <Checkbox value="1">Per Order</Checkbox>
                        <Checkbox value="2">Online Payment</Checkbox>
                        <Checkbox value="3">Cash on Delivery</Checkbox>
                      </CheckboxGroup>
                    )}
                  />
                </div>
                <div className="w-100">
                  <h3 className="mb-1">Subcriptions</h3>
                  <div className="mb-3 flex">
                    <Controller
                      name="isBooking"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          isSelected={
                            String(tempFormData?.isEnableEcommerce) === "1"
                              ? true
                              : false
                          }
                          checked={field.value === "1"} // Set checked based on the field's value
                          onChange={(e) =>
                            field.onChange(e.target.checked ? "1" : "0")
                          } // Update value on change
                          isDisabled={
                            !bookingSubscription?.subscriptionCount ||
                            String(productData?.data?.serviceType) === "Service" ||
                            Number(bookingSubscription?.subscriptionCount) <= 0
                          }
                        >
                          Enable booking
                          <span className="ml-2">
                            <Chip variant="flat" color="primary">
                              {Number(bookingSubscription?.subscriptionCount ?? 0)}
                            </Chip>
                          </span>
                        </Checkbox>
                      )}
                    />
                  </div>
                </div>
              </div>
              : <>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Controller
                        name="categoryId" // Changed to reflect a text input
                        control={control}
                        rules={{ required: "Please select value" }}
                        render={({ field }) => (
                          <Autocomplete
                            isRequired={true}
                            isInvalid={errors?.["categoryId"] ? true : false}
                            color={errors?.["categoryId"] ? "danger" : "default"}
                            listboxProps={{
                              itemClasses: {
                                base: [
                                  "rounded-md",
                                  "text-default-500",
                                  "transition-opacity",
                                  "data-[hover=true]:text-foreground",
                                  "data-[hover=true]:bg-default-100",
                                  "dark:data-[hover=true]:bg-default-50",
                                  "data-[selectable=true]:focus:bg-default-50",
                                  "data-[pressed=true]:opacity-90",
                                  "data-[focus-visible=true]:ring-default-500",
                                  "shadow-none",
                                  // "border-1",
                                ],
                              },
                            }}
                            label="Select Category"
                            variant="faded"
                            size="sm"
                            onSelectionChange={(selectedKey) => {
                              const valueToSave = selectedKey === null ? null : Number(selectedKey);
                              field.onChange(valueToSave); // Updates the form state
                            }}
                            selectedKey={String(tempFormData?.categoryId)}
                          >
                            {categoryData?.data?.map((item) => (
                              <AutocompleteItem key={String(item.id)} value={String(item.id)}>
                                {item.name}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                        )}
                      />
                    </div>
                    <Button
                      color="success"
                      variant="flat"
                      size="sm"
                      onPress={() => setIsCategoryModalOpen(true)}
                    >
                      + Add
                    </Button>
                  </div>
                  <Controller
                    name="status" // Changed to reflect a text input
                    control={control}
                    rules={{ required: "Please select value" }}
                    render={({ field }) => (
                      <Select
                        classNames={{
                          label: "group-data-[filled=true]:-translate-y-3",
                          trigger: [
                            "bg-transparent",
                            "border-1",
                            "text-default-500",
                            "transition-opacity",
                            "data-[hover=true]:bg-transparent",
                            "data-[hover=true]:bg-transparent",
                            "dark:data-[hover=true]:bg-transparent",
                            "data-[selectable=true]:focus:bg-transparent",
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
                              "dark:data-[hover=true]:bg-default-50",
                              "data-[selectable=true]:focus:bg-default-50",
                              "data-[pressed=true]:opacity-90",
                              "data-[focus-visible=true]:ring-default-500",
                              "shadow-none",
                              // "border-1",
                            ],
                          },
                        }}
                        label="Status"
                        variant="bordered"
                        size="sm"
                        selectedKeys={String(tempFormData?.status)}
                        {...field}
                        isRequired={true}
                        isInvalid={errors?.["status"] ? true : false}
                        errorMessage={errors?.["status"]?.message}
                      >
                        <SelectItem key={1} value={"1"}>
                          {"Active"}
                        </SelectItem>
                        <SelectItem key={0} value={"0"}>
                          {"InActive"}
                        </SelectItem>
                      </Select>
                    )}
                  />
                  <Controller
                    name="name" // Changed to reflect a text input
                    control={control}
                    rules={{ required: "Please enter value" }}
                    render={({ field }) => (
                      <InputNextUI
                        type="text"
                        label="Name"
                        {...field}
                        isRequired={true}
                        isInvalid={errors?.["name"] ? true : false}
                        errorMessage={errors?.["name"]?.message}
                      />
                    )}
                  />
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Checkbox
                        isSelected={enableSizeManagement}
                        onValueChange={(checked) => {
                          setEnableSizeManagement(checked);
                          if (!checked) {
                            // Clear size entries when disabled
                            setSizeEntries([]);
                            setSizeUnitSizeMap({});
                            setNewSize("");
                            setNewUnitSize("");
                            setNewPrice("");
                            setNewDiscount("");
                          }
                        }}
                      >
                        Enable Multiple Size Management
                      </Checkbox>
                    </div>

                    {enableSizeManagement ? (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Size, Unit Size & Price Management</h4>

                        <div className="flex gap-2 mb-3">
                          <Autocomplete
                            label="Select Size"
                            variant="bordered"
                            size="sm"
                            selectedKey={newSize || null}
                            inputValue={newSize}
                            onSelectionChange={(key) => {
                              const selectedValue = key ? String(key) : "";
                              const trimmedValue = selectedValue.trim();
                              
                              if (trimmedValue) {
                                setNewSize(trimmedValue);
                                sizeInputRef.current = trimmedValue; // Update ref too
                                
                                // If it's a custom value not in the base list, add it to custom sizes
                                if (!sizeExists(trimmedValue, baseSizeOptions) && 
                                    !sizeExists(trimmedValue, customSizes)) {
                                  setCustomSizes(prev => {
                                    // Check again to avoid duplicates
                                    if (!sizeExists(trimmedValue, prev)) {
                                      return [...prev, trimmedValue];
                                    }
                                    return prev;
                                  });
                                }
                              } else {
                                setNewSize("");
                                sizeInputRef.current = "";
                              }
                            }}
                            onInputChange={(value) => {
                              // Allow typing custom values - update state as user types
                              // Also update ref to preserve value during blur
                              sizeInputRef.current = value;
                              setNewSize(value);
                            }}
                            placeholder="Type to search, select, or add new size"
                            className="flex-1"
                            allowsCustomValue={true}
                            defaultFilter={(textValue, inputValue) => {
                              if (inputValue === "") return true;
                              const searchValue = inputValue.toLowerCase();
                              const itemValue = String(textValue).toLowerCase();
                              return itemValue.includes(searchValue);
                            }}
                            defaultItems={sizeOptions.map((size) => ({
                              key: size,
                              value: size,
                              label: size.toUpperCase(),
                            }))}
                            listboxProps={{
                              emptyContent: newSize && newSize.trim() !== "" && 
                                !sizeExists(newSize.trim(), sizeOptions)
                                ? `Press Enter or click outside to add "${newSize.trim()}" as new size`
                                : "No sizes found"
                            }}
                            onKeyDown={(e) => {
                              // Allow Enter key to add custom value
                              if (e.key === "Enter" && newSize && newSize.trim() !== "") {
                                const trimmedSize = newSize.trim();
                                // Check if it's a new custom size
                                if (!sizeExists(trimmedSize, baseSizeOptions) && 
                                    !sizeExists(trimmedSize, customSizes)) {
                                  e.preventDefault();
                                  setCustomSizes(prev => {
                                    // Double-check to avoid duplicates
                                    if (!sizeExists(trimmedSize, prev)) {
                                      return [...prev, trimmedSize];
                                    }
                                    return prev;
                                  });
                                }
                                // Always set the trimmed value
                                setNewSize(trimmedSize);
                                sizeInputRef.current = trimmedSize; // Update ref too
                              }
                            }}
                            onBlur={(e) => {
                              // Use the ref value which is more reliable during blur
                              const currentValue = sizeInputRef.current || newSize;
                              
                              if (currentValue && currentValue.trim() !== "") {
                                const trimmedSize = currentValue.trim();
                                
                                // Check if it's a new custom size and add it
                                if (!sizeExists(trimmedSize, baseSizeOptions) && 
                                    !sizeExists(trimmedSize, customSizes)) {
                                  setCustomSizes(prev => {
                                    // Double-check to avoid duplicates
                                    if (!sizeExists(trimmedSize, prev)) {
                                      return [...prev, trimmedSize];
                                    }
                                    return prev;
                                  });
                                }
                                
                                // Always preserve the trimmed value (don't clear it)
                                // Use setTimeout to ensure it happens after the blur event
                                setTimeout(() => {
                                  setNewSize(trimmedSize);
                                  sizeInputRef.current = trimmedSize;
                                }, 0);
                              }
                            }}
                          >
                            {(size) => (
                              <AutocompleteItem key={size.key} value={size.value}>
                                {size.label}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                          <Input
                            type="text"
                            label="Unit Size"
                            value={newUnitSize}
                            onChange={(e) => setNewUnitSize(e.target.value)}
                            placeholder="Enter unit size"
                            size="sm"
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            label="Price"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="Enter price"
                            size="sm"
                            className="flex-1"
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">₹</span>
                              </div>
                            }
                          />
                          <Button
                            color="primary"
                            size="lg"
                            onClick={() => {
                              if (newSize && newUnitSize && newPrice) {
                                const trimmedSize = newSize.trim();
                                
                                // If it's a custom size not in base list, ensure it's added to custom sizes
                                if (trimmedSize && 
                                    !sizeExists(trimmedSize, baseSizeOptions) && 
                                    !sizeExists(trimmedSize, customSizes)) {
                                  setCustomSizes(prev => {
                                    if (!sizeExists(trimmedSize, prev)) {
                                      return [...prev, trimmedSize];
                                    }
                                    return prev;
                                  });
                                }
                                
                                // Calculate discount values
                                const price = Number(newPrice) || 0;
                                const discount = Number(newDiscount) || 0;
                                const discountAmount = (price * discount) / 100;
                                const discountedPrice = price - discountAmount;
                                const qty = Number(newUnitSize) || 0;
                                const total = discountedPrice * qty;

                                // Check if size already exists (use trimmed size)
                                const existingIndex = sizeEntries.findIndex(entry => entry.size === trimmedSize);
                                if (existingIndex >= 0) {
                                  // Update existing entry
                                  const updated = [...sizeEntries];
                                  updated[existingIndex] = {
                                    ...updated[existingIndex],
                                    unitSize: newUnitSize,
                                    qty: newUnitSize, // Update quantity when unitSize changes
                                    price: newPrice,
                                    discount: String(discount),
                                    discountPer: String(discountAmount.toFixed(2)),
                                    total: String(total.toFixed(2)),
                                    grandTotal: String(total.toFixed(2))
                                  };
                                  setSizeEntries(updated);
                                } else {
                                  // Add new entry (use trimmed size)
                                  const newEntry = {
                                    size: trimmedSize,
                                    unitSize: newUnitSize,
                                    qty: newUnitSize, // Quantity same as unitSize initially
                                    price: newPrice,
                                    discount: String(discount),
                                    discountPer: String(discountAmount.toFixed(2)),
                                    total: String(total.toFixed(2)),
                                    grandTotal: String(total.toFixed(2)),
                                    id: `size-${Date.now()}-${Math.random()}`
                                  };
                                  setSizeEntries([...sizeEntries, newEntry]);
                                }
                                // Update the map (use trimmed size)
                                setSizeUnitSizeMap(prev => ({
                                  ...prev,
                                  [trimmedSize]: {
                                    unitSize: newUnitSize,
                                    qty: newUnitSize,
                                    price: newPrice,
                                    discount: String(discount),
                                    discountPer: String(discountAmount.toFixed(2)),
                                    total: String(total.toFixed(2)),
                                    grandTotal: String(total.toFixed(2))
                                  }
                                }));
                                // Reset inputs
                                setNewSize("");
                                setNewUnitSize("");
                                setNewPrice("");
                                setNewDiscount("");
                              }
                            }}
                            isDisabled={!newSize || !newUnitSize || !newPrice}
                          >
                            Add
                          </Button>
                        </div>

                        {sizeEntries.length > 0 && (
                          <div className="mt-4 overflow-x-auto">
                            <Table aria-label="Size entries table" removeWrapper>
                              <TableHeader>
                                <TableColumn>SIZE</TableColumn>
                                <TableColumn>UNIT SIZE</TableColumn>
                                <TableColumn>QUANTITY</TableColumn>
                                <TableColumn>PRICE</TableColumn>
                                <TableColumn>DISCOUNT (%)</TableColumn>
                                <TableColumn>DISCOUNT PRICE</TableColumn>
                                <TableColumn>TOTAL</TableColumn>
                                <TableColumn>GRAND TOTAL</TableColumn>
                                <TableColumn>ACTION</TableColumn>
                              </TableHeader>
                              <TableBody>
                                {sizeEntries.map((entry) => {
                                  // Recalculate on render to ensure accuracy
                                  const price = Number(entry.price) || 0;
                                  const discount = Number(entry.discount) || 0;
                                  const discountAmount = (price * discount) / 100;
                                  const discountedPrice = price - discountAmount;
                                  const qty = Number(entry.qty || entry.unitSize) || 0;
                                  const total = discountedPrice * qty;

                                  return (
                                    <TableRow key={entry.id}>
                                      <TableCell>
                                        <Chip variant="flat" color="primary">
                                          {entry.size.toUpperCase()}
                                        </Chip>
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          value={entry.unitSize}
                                          onChange={(e) => {
                                            const newUnitSize = e.target.value;
                                            const updated = sizeEntries.map(e =>
                                              e.id === entry.id
                                                ? { ...e, unitSize: newUnitSize, total: String((discountedPrice * Number(entry.qty || newUnitSize)).toFixed(2)), grandTotal: String((discountedPrice * Number(entry.qty || newUnitSize)).toFixed(2)) }
                                                : e
                                            );
                                            setSizeEntries(updated);
                                            setSizeUnitSizeMap(prev => ({
                                              ...prev,
                                              [entry.size]: {
                                                ...prev[entry.size],
                                                unitSize: newUnitSize,
                                                total: String((discountedPrice * Number(entry.qty || newUnitSize)).toFixed(2)),
                                                grandTotal: String((discountedPrice * Number(entry.qty || newUnitSize)).toFixed(2))
                                              }
                                            }));
                                          }}
                                          size="sm"
                                          className="w-20"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          value={entry.qty || entry.unitSize}
                                          onChange={(e) => {
                                            const newQty = e.target.value;
                                            const updated = sizeEntries.map(e =>
                                              e.id === entry.id
                                                ? { ...e, qty: newQty, total: String((discountedPrice * Number(newQty)).toFixed(2)), grandTotal: String((discountedPrice * Number(newQty)).toFixed(2)) }
                                                : e
                                            );
                                            setSizeEntries(updated);
                                            setSizeUnitSizeMap(prev => ({
                                              ...prev,
                                              [entry.size]: {
                                                ...prev[entry.size],
                                                qty: newQty,
                                                total: String((discountedPrice * Number(newQty)).toFixed(2)),
                                                grandTotal: String((discountedPrice * Number(newQty)).toFixed(2))
                                              }
                                            }));
                                          }}
                                          size="sm"
                                          className="w-20"
                                          placeholder="Qty"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          value={entry.price}
                                          onChange={(e) => {
                                            const newPrice = Number(e.target.value) || 0;
                                            const discount = Number(entry.discount) || 0;
                                            const discountAmount = (newPrice * discount) / 100;
                                            const discountedPrice = newPrice - discountAmount;
                                            const qty = Number(entry.unitSize) || 0;
                                            const total = discountedPrice * qty;

                                            const updated = sizeEntries.map(e =>
                                              e.id === entry.id
                                                ? { ...e, price: String(newPrice), discountPer: String(discountAmount.toFixed(2)), total: String(total.toFixed(2)), grandTotal: String(total.toFixed(2)) }
                                                : e
                                            );
                                            setSizeEntries(updated);
                                            setSizeUnitSizeMap(prev => ({
                                              ...prev,
                                              [entry.size]: {
                                                ...prev[entry.size],
                                                price: String(newPrice),
                                                discountPer: String(discountAmount.toFixed(2)),
                                                total: String(total.toFixed(2)),
                                                grandTotal: String(total.toFixed(2))
                                              }
                                            }));
                                          }}
                                          size="sm"
                                          className="w-24"
                                          startContent={<span className="text-default-400 text-small">₹</span>}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          value={entry.discount}
                                          onChange={(e) => {
                                            const newDiscount = Number(e.target.value) || 0;
                                            const price = Number(entry.price) || 0;
                                            const discountAmount = (price * newDiscount) / 100;
                                            const discountedPrice = price - discountAmount;
                                            const qty = Number(entry.qty || entry.unitSize) || 0;
                                            const total = discountedPrice * qty;

                                            const updated = sizeEntries.map(e =>
                                              e.id === entry.id
                                                ? { ...e, discount: String(newDiscount), discountPer: String(discountAmount.toFixed(2)), total: String(total.toFixed(2)), grandTotal: String(total.toFixed(2)) }
                                                : e
                                            );
                                            setSizeEntries(updated);
                                            setSizeUnitSizeMap(prev => ({
                                              ...prev,
                                              [entry.size]: {
                                                ...prev[entry.size],
                                                discount: String(newDiscount),
                                                discountPer: String(discountAmount.toFixed(2)),
                                                total: String(total.toFixed(2)),
                                                grandTotal: String(total.toFixed(2))
                                              }
                                            }));
                                          }}
                                          size="sm"
                                          className="w-20"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <span className="font-medium">₹{discountAmount.toFixed(2)}</span>
                                      </TableCell>
                                      <TableCell>
                                        <span className="font-medium">₹{total.toFixed(2)}</span>
                                      </TableCell>
                                      <TableCell>
                                        <span className="font-medium">₹{total.toFixed(2)}</span>
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          color="danger"
                                          size="sm"
                                          variant="light"
                                          onClick={() => {
                                            const updated = sizeEntries.filter(e => e.id !== entry.id);
                                            setSizeEntries(updated);
                                            // Update map
                                            const updatedMap = { ...sizeUnitSizeMap };
                                            delete updatedMap[entry.size];
                                            setSizeUnitSizeMap(updatedMap);
                                          }}
                                        >
                                          Remove
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                  <Controller
                    name="weight"
                    control={control}
                    render={({ field }) => (
                      <InputNextUI
                        type="text"
                        label="Weight"
                        {...field}
                        placeholder="Enter weight"
                      />
                    )}
                  />
                  <Controller
                    name="sortDesc" // Changed to reflect a text input
                    control={control}
                    rules={{ required: "Please enter value" }}
                    render={({ field }) => (
                      <InputNextUI
                        type="text"
                        label="Sort Description"
                        {...field}
                        isRequired={true}
                        isInvalid={errors?.["sortDesc"] ? true : false}
                        errorMessage={errors?.["sortDesc"]?.message}
                      />
                    )}
                  />

                  {!enableSizeManagement && (
                    <>
                      <Controller
                        name="unitSize" // Changed to reflect a text input
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <InputNextUI
                            type="text"
                            label="Unit Size"
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        name="price" // Changed to reflect a text input
                        control={control}
                        rules={{ required: "Please enter value" }}
                        render={({ field }) => (
                          <InputNextUI
                            type="text"
                            label="Price"
                            onChange={(value) => {
                              setValue("grand_total", value);
                            }}
                            {...field}
                            isRequired={true}
                            isInvalid={errors?.["price"] ? true : false}
                            errorMessage={errors?.["price"]?.message}
                          />
                        )}
                      />
                      <Controller
                        name="qty" // Changed to reflect a text input
                        control={control}
                        rules={{ required: "Please enter value" }}
                        render={({ field }) => (
                          <InputNextUI
                            type="text"
                            label="Quantity"
                            {...field}
                            isRequired={true}
                            isInvalid={errors?.["qty"] ? true : false}
                            errorMessage={errors?.["qty"]?.message}
                          />
                        )}
                      />
                      <Controller
                        name="discount" // Changed to reflect a text input
                        control={control}
                        rules={{ required: "Please enter value" }}
                        render={({ field }) => (
                          <InputNextUI
                            type="text"
                            label="Discoint(%)"
                            {...field}
                            isRequired={true}
                            isInvalid={errors?.["discount"] ? true : false}
                            errorMessage={errors?.["discount"]?.message}
                          />
                        )}
                      />
                      <Controller
                        name="discountPer" // Changed to reflect a text input
                        control={control}
                        rules={{ required: "Please enter value" }}
                        render={({ field }) => (
                          <InputNextUI
                            type="text"
                            label="Discount Price"
                            {...field}
                            isDisabled
                            isRequired={true}
                            isInvalid={errors?.["discountPer"] ? true : false}
                            errorMessage={errors?.["discountPer"]?.message}
                          />
                        )}
                      />
                      <Controller
                        name="total" // Changed to reflect a text input
                        control={control}
                        render={({ field }) => (
                          <InputNextUI
                            type="text"
                            label="Total"
                            onChange={(value) => {
                              console.log(value, "ownername");
                            }}
                            isDisabled
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        name="grand_total" // Changed to reflect a text input
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <InputNextUI
                            type="text"
                            label="Grant total"
                            isDisabled
                            {...field}
                            errorMessage={errors?.["grand_total"]?.message}
                          />
                        )}
                      />
                    </>
                  )}

                  <div className="flex">
                    <Controller
                      name="photo"
                      control={control}
                      render={({ field }) => (
                        <div style={{ position: "relative", width: "100%" }}>
                          <input
                            type="file"
                            id="file"
                            accept="image/*"
                            style={{
                              opacity: 0,
                              position: "absolute",
                              zIndex: -1,
                              width: "100%",
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 500 * 1024) { // 500KB limit
                                  alert("File size exceeds 500KB. Please select a smaller file.");
                                  e.target.value = ''; // Clear the input
                                  setSelectedFileName("No file selected");
                                } else {
                                  field.onChange(file); // Update form state with selected file
                                  setSelectedFileName(file.name);
                                }
                              } else {
                                setSelectedFileName("No file selected");
                              }
                            }}
                          />
                          <label
                            htmlFor="file"
                            style={{
                              border: "1px solid rgba(128, 128, 128, 0.3)",
                              borderRadius: "7px",
                              padding: "10px",
                              width: "100%",
                              display: "inline-block",
                              textAlign: "center",
                              cursor: "pointer",
                              fontSize: "14px",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(128, 128, 128, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            Choose File
                          </label>
                          <span
                            style={{
                              marginLeft: "10px",
                              textAlign: "start",
                              fontSize: "12px",
                              color: selectedFileName === "No file selected" ? "#666" : "#000",
                              fontWeight: selectedFileName !== "No file selected" ? "500" : "normal",
                            }}
                          >
                            {selectedFileName}
                          </span>
                        </div>
                      )}
                    />
                    {/* {productData?.data?.photo && ( */}
                    <Image
                      src={`${productData?.data?.photo}`}
                      className="h-20 ml-2"
                      width={100}
                    />
                    {/* )} */}
                  </div>
                  {/* Sub Images Upload Section */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Product Photos</label>
                      <input
                        type="file"
                        id="subImagesService"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;

                          // Check total image limit (existing + current + new)
                          const currentTotal = existingSubImages.length + subImages.length;
                          const maxImages = 3;
                          
                          if (currentTotal >= maxImages) {
                            alert(`Maximum ${maxImages} product photos allowed. Please remove some images before adding new ones.`);
                            e.target.value = '';
                            return;
                          }

                          // Calculate how many new images can be added
                          const remainingSlots = maxImages - currentTotal;
                          const filesToAdd = files.slice(0, remainingSlots);
                          
                          if (files.length > remainingSlots) {
                            alert(`You can only add ${remainingSlots} more image(s). Maximum ${maxImages} product photos allowed.`);
                          }

                          // Validate file sizes
                          const invalidFiles = filesToAdd.filter(file => file.size > 500 * 1024);
                          if (invalidFiles.length > 0) {
                            alert(`${invalidFiles.length} file(s) exceed 500KB limit. Please select smaller files.`);
                            e.target.value = '';
                            return;
                          }

                          // Create preview URLs and add to subImages
                          const newSubImages = filesToAdd.map(file => ({
                            file,
                            preview: URL.createObjectURL(file)
                          }));

                          setSubImages(prev => [...prev, ...newSubImages]);
                          e.target.value = ''; // Clear the input
                        }}
                      />
                      <Button
                        color="secondary"
                        variant="flat"
                        size="sm"
                        isDisabled={existingSubImages.length + subImages.length >= 3}
                        onClick={() => {
                          if (existingSubImages.length + subImages.length >= 3) {
                            alert("Maximum 3 product photos allowed. Please remove some images before adding new ones.");
                            return;
                          }
                          document.getElementById("subImagesService")?.click();
                        }}
                      >
                        + Add Product Photos
                        {existingSubImages.length + subImages.length > 0 && (
                          <span className="ml-1 text-xs">
                            ({existingSubImages.length + subImages.length}/3)
                          </span>
                        )}
                      </Button>
                    </div>

                    {/* Display Selected Sub Images (New) */}
                    {subImages.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-2">Selected Images (will be uploaded on save):</p>
                        <div className="grid grid-cols-4 gap-3">
                          {subImages.map((subImage, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={subImage.preview}
                                alt={`Sub image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                                width={100}
                                height={100}
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                                {(subImage.file.size / 1024).toFixed(1)} KB
                              </div>
                              <Button
                                color="danger"
                                size="sm"
                                variant="flat"
                                isIconOnly
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  // Revoke object URL to prevent memory leak
                                  URL.revokeObjectURL(subImage.preview);
                                  setSubImages(prev => prev.filter((_, i) => i !== index));
                                }}
                              >
                                <svg
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M18 6L6 18M6 6L18 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Display Existing Sub Images (from API) */}
                    {existingSubImages.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-2">Existing Images:</p>
                        <div className="grid grid-cols-4 gap-3">
                          {existingSubImages.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={imageUrl}
                                alt={`Existing sub image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                                width={100}
                                height={100}
                              />
                              <Button
                                color="danger"
                                size="sm"
                                variant="flat"
                                isIconOnly
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setExistingSubImages(prev => prev.filter((_, i) => i !== index));
                                }}
                              >
                                <svg
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M18 6L6 18M6 6L18 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <Controller
                    name="paymentMode" // Changed to reflect a text input
                    control={control}
                    rules={{ required: "Please enter value" }}
                    render={({ field }) => (
                      <CheckboxGroup
                        label="Select Payment Type"
                        orientation="horizontal"
                        color="secondary"
                        {...field}
                        defaultValue={["1", "2", "3"]}
                      >
                        <Checkbox value="1">Per Order</Checkbox>
                        <Checkbox value="2">Online Payment</Checkbox>
                        <Checkbox value="3">Cash on Delivery</Checkbox>
                      </CheckboxGroup>
                    )}
                  />
                  <div className="w-100">
                    <h3 className="mb-1">Subcriptions</h3>
                    <div className="mb-3 flex">
                      <Controller
                        name="isEnableEcommerce"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            isSelected={
                              String(tempFormData?.isEnableEcommerce) === "1"
                                ? true
                                : false
                            }
                            checked={field.value === "1"} // Set checked based on the field's value
                            onChange={(e) =>
                              field.onChange(e.target.checked ? "1" : "0")
                            } // Update value on change
                            isDisabled={
                              !ecommerceSubscription?.subscriptionCount ||
                              String(productData?.data?.isEnableEcommerce) === "1" ||
                              Number(ecommerceSubscription?.subscriptionCount) -
                              filteredEcommereceData?.length <=
                              0
                            }
                          >
                            Enable Ecommerce
                            <span className="ml-2">
                              <Chip variant="flat" color="primary">
                                {Number(ecommerceSubscription?.subscriptionCount ?? 0) - filteredEcommereceData?.length}
                              </Chip>
                            </span>
                          </Checkbox>
                        )}
                      />
                      <span className="ml-3">
                        <Controller
                          name="isEnableCustomize"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              isSelected={
                                String(tempFormData?.isEnableCustomize) === "1"
                                  ? true
                                  : false
                              }
                              checked={field.value === "1"} // Set checked based on the field's value
                              onChange={(e) =>
                                field.onChange(e.target.checked ? "1" : "0")
                              } // Update value on change
                              isDisabled={
                                !customizeSubscription?.subscriptionCount ||
                                String(productData?.data?.isEnableCustomize) ===
                                "1" ||
                                Number(customizeSubscription?.subscriptionCount) -
                                filteredCustomizeData?.length <=
                                0
                              }
                            >
                              Enable Customize{" "}
                              <span>
                                <Chip variant="flat" color="primary">
                                  {Number(customizeSubscription?.subscriptionCount ?? 0) - filteredCustomizeData?.length}
                                </Chip>
                              </span>
                            </Checkbox>
                          )}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </>
          }
        </div>
      </form>
      <SubscriptionExpiredModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
      <Modal 
        isOpen={isBarcodeModalOpen} 
        onOpenChange={setIsBarcodeModalOpen}
        placement="center"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Print Barcode
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div>
                    <Input
                      type="number"
                      label="Count"
                      placeholder="Enter number of barcodes to print"
                      value={String(barcodeCount)}
                      onChange={(e) => setBarcodeCount(Number(e.target.value) || 1)}
                      min={1}
                      size="sm"
                    />
                  </div>
                  {productId && productData?.data && (
                    <div className="flex flex-col items-center gap-4 p-4">
                      <div className="text-sm font-semibold">Barcode Preview</div>
                      {enableSizeManagement && sizeEntries.length > 0 ? (
                        <div className="flex flex-col gap-4 w-full">
                          {sizeEntries.map((entry, index) => (
                            <BarcodePreview 
                              key={entry.id || index}
                              productData={productData.data} 
                              storeData={storeData?.data}
                              sizeEntry={entry}
                            />
                          ))}
                        </div>
                      ) : (
                        <BarcodePreview 
                          productData={productData.data} 
                          storeData={storeData?.data}
                        />
                      )}
                    </div>
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
                    handlePrintBarcode(barcodeCount);
                    onClose();
                  }}
                >
                  Print {barcodeCount} Barcode{barcodeCount > 1 ? 's' : ''}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
        selectedCategoryId={tempFormData?.categoryId}
        onCategorySelect={(categoryId) => {
          setValue("categoryId", categoryId);
          categoryrefetch(); // Refetch categories to update the list
        }}
        label="Manage Categories"
      />
    </div>
  );
};

// Barcode Preview Component with Label Design
const BarcodePreview = ({ productData, storeData, sizeEntry }: { productData: any; storeData?: any; sizeEntry?: any }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const productIdStr = String(productData?.id || "");
  const productName = productData?.name || "Product";
  // Use sizeEntry data if available, otherwise use productData
  const productMRP = sizeEntry?.price || productData?.price || productData?.total || "0";
  const productSize = sizeEntry?.size ? sizeEntry.size.toUpperCase() : (productData?.size || "N/A");
  const productColor = productData?.color || "N/A";
  const unitSize = sizeEntry?.unitSize || productData?.unitSize || "0";
  const currentStoreName = storeData?.storeName || storeData?.storename || "STORE";
  
  // Generate side numbers
  const leftSideNumber = productIdStr.slice(-4) || "0000";
  const rightSideNumber = productIdStr.padStart(8, '0') || "00000000";

  React.useEffect(() => {
    if (canvasRef.current && productIdStr) {
      try {
        // Clear canvas first
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        
        JsBarcode(canvasRef.current, productIdStr, {
          format: "CODE128",
          width: 2.5,
          height: 70,
          displayValue: false,
          margin: 5,
          background: "#ffffff",
          lineColor: "#000000",
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [productIdStr]);

  return (
    <div className="flex flex-col items-center">
      <div 
        className="bg-white border-2 border-black p-3"
        style={{
          width: '90mm',
          height: '65mm',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-2" style={{ fontSize: '14px' }}>
          <div className="text-left">
            <div className="font-bold text-lg leading-tight">{productName}</div>
            <div className="text-sm mt-1">{productIdStr}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">{currentStoreName}</div>
          </div>
        </div>

        {/* Barcode Section */}
        <div className="flex items-center justify-center my-2" style={{ minHeight: '100px', position: 'relative' }}>
          {/* Left Side Number */}
          <div 
            className="font-bold text-sm"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              padding: '0 5px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {leftSideNumber}
          </div>

          {/* Barcode */}
          <div className="flex-1 flex flex-col items-center">
            <canvas 
              ref={canvasRef} 
              style={{ 
                maxWidth: '100%',
                height: 'auto',
                imageRendering: 'crisp-edges'
              }}
            />
            <div className="text-xs font-bold mt-1" style={{ letterSpacing: '1px' }}>
              {productIdStr}
            </div>
          </div>

          {/* Right Side Number */}
          <div 
            className="font-bold text-sm"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              padding: '0 5px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightSideNumber}
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex justify-between mt-2 text-xs">
          <div className="text-left">
            <div className="font-bold text-xs mb-1">M.R.P. ₹ :-</div>
            <div className="text-sm">{Math.round(Number(productMRP))}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xs mb-1">COLOUR</div>
            <div className="text-sm">{productColor}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xs mb-1">SIZE</div>
            <div className="text-sm">{productSize}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
