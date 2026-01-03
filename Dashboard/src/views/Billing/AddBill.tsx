import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Image,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import { useAddBillMutation } from "./Service.mjs";
import { useGetStoresProductByIDQuery } from "../Store/Service.mjs";
import { useUpdateProductMutation } from "../Products/Service.mjs";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import InputNextUI from "../../Components/Common/Input/input";
import TeaxtareaNextUI from "../../Components/Common/Input/Textarea";
import { infoData } from "../../configData";
import { getAuthHeaders } from "../../utils/authHelper.mjs";
import { websocketClient } from "../../utils/websocketClient";
import BarcodeScanner from "../../Components/BarcodeScanner/BarcodeScanner";
import ErrorBoundary from "../../Components/BarcodeScanner/ErrorBoundary";

interface SelectedProduct {
  id: number;
  name: string;
  photo?: string;
  price: number;
  quantity: number;
  total: number;
  size?: string;
  weight?: string;
  productId?: number; // Store product ID to access product details
  sizeUnitSizeMap?: Record<string, { unitSize: string; qty: string; price: string; discount: string; discountPer: string; total: string; grandTotal: string }>; // Store size pricing map
}

const AddBill = () => {
  const storeId = getCookie("storeId");
  const vendorId = getCookie("vendorId");
  const userId = storeId || vendorId || getCookie("id");
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [addBill, { isLoading: isSubmitting }] = useAddBillMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [selectedProducts, setSelectedProducts] = React.useState<
    SelectedProduct[]
  >([]);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);

  // WebSocket state for barcode scanning
  const [isWebSocketConnected, setIsWebSocketConnected] = React.useState(false);
  const [lastScannedBarcode, setLastScannedBarcode] = React.useState<string | null>(null);

  const {
    data: productsData,
    refetch: refetchProducts,
  } = useGetStoresProductByIDQuery(Number(storeId), { skip: !storeId, refetchOnMountOrArgChange: true });

  const products = productsData?.data || [];

  const handleAddProduct = () => {
    if (!selectedProductId) return;

    const storeProduct = products.find((p: any) => p.id === selectedProductId);
    if (!storeProduct || !storeProduct.product) return;

    const product = storeProduct.product;

    // Parse sizeUnitSizeMap if it exists
    let sizeUnitSizeMap: Record<string, { unitSize: string; qty: string; price: string; discount: string; discountPer: string; total: string; grandTotal: string }> | undefined;
    if (product.sizeUnitSizeMap) {
      try {
        sizeUnitSizeMap = typeof product.sizeUnitSizeMap === 'string'
          ? JSON.parse(product.sizeUnitSizeMap)
          : product.sizeUnitSizeMap;
      } catch (e) {
        console.warn('Failed to parse sizeUnitSizeMap:', e);
        sizeUnitSizeMap = undefined;
      }
    }

    // Use store product price if available, otherwise use product total
    const productPrice = storeProduct.price || product.total || product.price || 0;

    // Generate a unique ID for this product entry (allows same product with different sizes)
    const uniqueId = selectedProducts.length > 0
      ? Math.max(...selectedProducts.map(p => p.id)) + 1
      : storeProduct.id;

    const newProduct: SelectedProduct = {
      id: uniqueId,
      name: product.name,
      photo: product.photo,
      price: productPrice,
      quantity: 1,
      total: productPrice,
      size: "",
      weight: "",
      productId: product.id,
      sizeUnitSizeMap: sizeUnitSizeMap,
    };

    setSelectedProducts([...selectedProducts, newProduct]);
    // Don't clear selectedProductId to allow adding same product multiple times with different sizes
    // setSelectedProductId(null);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.id !== productId)
    );
    // Clear last scanned barcode to allow re-scanning the same product
    setLastScannedBarcode(null);
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    const updatedProducts = selectedProducts.map((p) => {
      if (p.id === productId) {
        const newQuantity = Math.max(1, quantity);
        return {
          ...p,
          quantity: newQuantity,
          total: p.price * newQuantity,
        };
      }
      return p;
    });
    setSelectedProducts(updatedProducts);
  };

  const handlePriceChange = (productId: number, price: number) => {
    const updatedProducts = selectedProducts.map((p) => {
      if (p.id === productId) {
        const newPrice = Math.max(0, price);
        return {
          ...p,
          price: newPrice,
          total: newPrice * p.quantity,
        };
      }
      return p;
    });
    setSelectedProducts(updatedProducts);
  };

  const handleSizeChange = (productId: number, size: string) => {
    const updatedProducts = selectedProducts.map((p) => {
      if (p.id === productId) {
        let newPrice = p.price;
        let actualSizeKey = size.trim(); // Store the actual key from sizeUnitSizeMap

        // If size is selected and product has sizeUnitSizeMap, update price based on size
        if (size && size.trim() !== '' && p.sizeUnitSizeMap) {
          // Find the matching key (case-insensitive)
          const matchingKey = Object.keys(p.sizeUnitSizeMap).find(
            key => key.toLowerCase() === size.toLowerCase().trim()
          );

          if (matchingKey) {
            actualSizeKey = matchingKey; // Use the actual key from the map
            const sizeData = p.sizeUnitSizeMap[matchingKey];

            if (sizeData) {
              // Use the price from size data, or fallback to total/grandTotal if price not available
              const sizePrice = Number(sizeData.price) || Number(sizeData.total) || Number(sizeData.grandTotal) || 0;
              if (sizePrice > 0) {
                newPrice = sizePrice;
              }
            }
          }
        } else if (!size || size.trim() === '') {
          // If size is cleared, reset to original product price
          const storeProduct = products.find((sp: any) => sp.product?.id === p.productId);
          if (storeProduct && storeProduct.product) {
            newPrice = storeProduct.price || storeProduct.product.total || storeProduct.product.price || 0;
          }
          actualSizeKey = ""; // Clear the size
        }

        return {
          ...p,
          size: actualSizeKey, // Store the actual key (preserving case from sizeUnitSizeMap)
          price: newPrice,
          total: newPrice * p.quantity, // Recalculate total with new price
        };
      }
      return p;
    });
    setSelectedProducts(updatedProducts);
  };

  const handleWeightChange = (productId: number, weight: string) => {
    const updatedProducts = selectedProducts.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          weight: weight,
        };
      }
      return p;
    });
    setSelectedProducts(updatedProducts);
  };

  const sizeOptions = ["xs", "s", "m", "l", "xl", "xxl", "xxxl", "xxxxl"];

  // WebSocket connection for barcode scanning
  React.useEffect(() => {
    // Connect to WebSocket server
    websocketClient.connect({
      onConnected: () => {
        console.log('[AddBill] WebSocket connected');
        setIsWebSocketConnected(true);
      },
      onDisconnected: () => {
        console.log('[AddBill] WebSocket disconnected');
        setIsWebSocketConnected(false);
      },
      onBarcodeReceived: (barcode: string) => {
        console.log('[AddBill] Barcode received:', barcode);
        setLastScannedBarcode(barcode);
        handleBarcodeScanned(barcode);
      },
      onError: (error) => {
        console.error('[AddBill] WebSocket error:', error);
        setIsWebSocketConnected(false);
      }
    });

    // Cleanup on unmount
    return () => {
      websocketClient.disconnect();
    };
  }, []);

  // Handle barcode scanned - find and add product automatically
  const handleBarcodeScanned = React.useCallback((barcode: string) => {
    if (!barcode || barcode.trim() === '') return;

    const productIdToSearch = barcode.trim();
    setLastScannedBarcode(productIdToSearch);

    // Try to find in existing products
    const storeProduct = products.find((p: any) =>
      p.product?.id?.toString() === productIdToSearch ||
      p.id?.toString() === productIdToSearch ||
      p.product?.slug?.toString() === productIdToSearch
    );

    if (storeProduct && storeProduct.product) {
      // Auto-add product directly
      const product = storeProduct.product;

      // Parse sizeUnitSizeMap if it exists
      let sizeUnitSizeMap: Record<string, { unitSize: string; qty: string; price: string; discount: string; discountPer: string; total: string; grandTotal: string }> | undefined;
      if (product.sizeUnitSizeMap) {
        try {
          sizeUnitSizeMap = typeof product.sizeUnitSizeMap === 'string'
            ? JSON.parse(product.sizeUnitSizeMap)
            : product.sizeUnitSizeMap;
        } catch (e) {
          console.warn('Failed to parse sizeUnitSizeMap:', e);
          sizeUnitSizeMap = undefined;
        }
      }

      const productPrice = storeProduct.price || product.total || product.price || 0;

      setSelectedProducts(prev => {
        const uniqueId = prev.length > 0
          ? Math.max(...prev.map(p => p.id)) + 1
          : storeProduct.id;

        const newProduct: SelectedProduct = {
          id: uniqueId,
          name: product.name,
          photo: product.photo,
          price: productPrice,
          quantity: 1,
          total: productPrice,
          size: "",
          weight: "",
          productId: product.id,
          sizeUnitSizeMap: sizeUnitSizeMap,
        };

        return [...prev, newProduct];
      });

      // Show success feedback
      console.log(`✅ Product added: ${product.name}`);
      // Clear last scanned barcode after a short delay to allow re-scanning
      setTimeout(() => {
        setLastScannedBarcode(null);
      }, 1000);
    } else {
      // Try to fetch product by ID from API
      const fetchProductById = async () => {
        try {
          const headers = getAuthHeaders();
          const response = await fetch(
            `${infoData.baseApi}/product/getProductById/${productIdToSearch}`,
            { headers }
          );

          if (response.ok) {
            const productData = await response.json();
            if (productData.success && productData.data) {
              // Product found, but need to find matching store product
              const matchingStoreProduct = products.find((p: any) =>
                p.product?.id === productData.data.id
              );

              if (matchingStoreProduct) {
                // Auto-add product directly
                const product = matchingStoreProduct.product;

                let sizeUnitSizeMap: Record<string, any> | undefined;
                if (product.sizeUnitSizeMap) {
                  try {
                    sizeUnitSizeMap = typeof product.sizeUnitSizeMap === 'string'
                      ? JSON.parse(product.sizeUnitSizeMap)
                      : product.sizeUnitSizeMap;
                  } catch (e) {
                    sizeUnitSizeMap = undefined;
                  }
                }

                const productPrice = matchingStoreProduct.price || product.total || product.price || 0;

                setSelectedProducts(prev => {
                  const uniqueId = prev.length > 0
                    ? Math.max(...prev.map(p => p.id)) + 1
                    : matchingStoreProduct.id;

                  const newProduct: SelectedProduct = {
                    id: uniqueId,
                    name: product.name,
                    photo: product.photo,
                    price: productPrice,
                    quantity: 1,
                    total: productPrice,
                    size: "",
                    weight: "",
                    productId: product.id,
                    sizeUnitSizeMap: sizeUnitSizeMap,
                  };

                  return [...prev, newProduct];
                });
                console.log(`✅ Product added: ${product.name}`);
                // Clear last scanned barcode after a short delay to allow re-scanning
                setTimeout(() => {
                  setLastScannedBarcode(null);
                }, 1000);
              } else {
                console.warn(`Product ${productIdToSearch} found but not in store products`);
                alert(`Product found but not available in your store: ${productData.data.name}`);
              }
            } else {
              console.warn(`Product not found: ${productIdToSearch}`);
              alert(`Product not found: ${productIdToSearch}`);
            }
          } else {
            console.warn(`Failed to fetch product: ${productIdToSearch}`);
            alert(`Failed to fetch product: ${productIdToSearch}`);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          alert(`Error fetching product: ${productIdToSearch}`);
        }
      };

      fetchProductById();
    }
  }, [products]);

  const handleOpenScanner = () => {
    const scannerUrl = '/scan-product.html';
    window.open(scannerUrl, '_blank', 'width=600,height=800');
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce((sum, product) => sum + product.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountPercent = watch("discount") || 0;
    const taxPercent = watch("tax") || 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    const taxAmount = (subtotal * taxPercent) / 100;
    return subtotal - discountAmount + taxAmount;
  };

  const getDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    const discountPercent = watch("discount") || 0;
    return (subtotal * discountPercent) / 100;
  };

  const getTaxAmount = () => {
    const subtotal = calculateSubtotal();
    const taxPercent = watch("tax") || 0;
    return (subtotal * taxPercent) / 100;
  };

  // Helper function to update product unitSize (size-specific or default)
  const updateProductUnitSize = async (productId: number, quantity: number, size?: string) => {
    try {
      // Fetch current product data with authentication
      const headers = getAuthHeaders();
      const productResponse = await fetch(
        `${infoData.baseApi}/product/getProductById/${productId}`,
        {
          method: 'GET',
          headers: headers,
        }
      );

      if (!productResponse.ok) {
        console.warn(`Failed to fetch product ${productId}. Status: ${productResponse.status}`);
        return;
      }

      const productResult = await productResponse.json();
      const product = productResult?.data;

      if (!product) {
        console.warn(`Product ${productId} not found`);
        return;
      }

      // Check if product has sizeUnitSizeMap and size is provided
      if (size && size.trim() !== '' && product.sizeUnitSizeMap) {
        try {
          // Parse sizeUnitSizeMap (handle both string and object formats)
          let sizeUnitSizeMap: Record<string, any>;
          if (typeof product.sizeUnitSizeMap === 'string') {
            try {
              sizeUnitSizeMap = JSON.parse(product.sizeUnitSizeMap);
            } catch (parseError) {
              console.warn(`Error parsing sizeUnitSizeMap string for product ${productId}:`, parseError);
              // Fall through to default flow
              sizeUnitSizeMap = {};
            }
          } else if (typeof product.sizeUnitSizeMap === 'object' && product.sizeUnitSizeMap !== null) {
            sizeUnitSizeMap = product.sizeUnitSizeMap;
          } else {
            console.warn(`Invalid sizeUnitSizeMap format for product ${productId}`);
            // Fall through to default flow
            sizeUnitSizeMap = {};
          }

          // Find matching size key (case-insensitive)
          let matchingSizeKey: string | null = null;
          const normalizedSize = size.trim().toLowerCase();

          for (const key in sizeUnitSizeMap) {
            if (key.toLowerCase() === normalizedSize) {
              matchingSizeKey = key;
              break;
            }
          }

          if (matchingSizeKey && sizeUnitSizeMap[matchingSizeKey]) {
            const sizeData = sizeUnitSizeMap[matchingSizeKey];
            let currentSizeUnitSize = 0;

            // Extract current unitSize from sizeData
            if (typeof sizeData === 'object' && sizeData !== null) {
              // Handle object format: { unitSize: "10", price: "100", ... }
              currentSizeUnitSize = Number(sizeData.unitSize) || 0;
            } else if (typeof sizeData === 'string') {
              // Handle string format (legacy)
              currentSizeUnitSize = Number(sizeData) || 0;
            } else if (typeof sizeData === 'number') {
              // Handle number format
              currentSizeUnitSize = sizeData;
            }

            // Validate stock availability
            if (currentSizeUnitSize <= 0) {
              console.warn(`Size ${size} (${matchingSizeKey}) has no stock available for product ${productId}`);
              return;
            }

            if (currentSizeUnitSize < quantity) {
              console.warn(`Insufficient stock for size ${size} (${matchingSizeKey}). Available: ${currentSizeUnitSize}, Requested: ${quantity}`);
              return;
            }

            const newSizeUnitSize = currentSizeUnitSize - quantity;

            // Update the size-specific unitSize in the map while preserving all other fields
            if (typeof sizeData === 'object' && sizeData !== null) {
              // Preserve all existing fields and update only unitSize
              const updatedSizeData = {
                ...sizeData,
                unitSize: newSizeUnitSize.toString(),
              };
              sizeUnitSizeMap[matchingSizeKey] = updatedSizeData;
            } else {
              // If sizeData is not an object, create a new object structure
              sizeUnitSizeMap[matchingSizeKey] = {
                unitSize: newSizeUnitSize.toString(),
                price: '',
                qty: '',
                discount: '',
                discountPer: '',
                total: '',
                grandTotal: '',
                name: product.name || "",
                photo: product.photo || "",
              };
            }

            // Update the product with modified sizeUnitSizeMap
            await updateProduct({
              id: productId,
              sizeUnitSizeMap: JSON.stringify(sizeUnitSizeMap),
            }).unwrap();

            console.log(`✅ Successfully updated product ${productId} size "${matchingSizeKey}" unitSize from ${currentSizeUnitSize} to ${newSizeUnitSize}`);
            return; // Exit early since we updated size-specific stock
          } else {
            console.warn(`Size "${size}" not found in sizeUnitSizeMap for product ${productId}. Available sizes: ${Object.keys(sizeUnitSizeMap).join(', ')}`);
            // Fall through to default flow
          }
        } catch (e) {
          console.warn(`Error processing sizeUnitSizeMap for product ${productId}:`, e);
          // Fall through to default flow
        }
      }

      // Default flow: Update main product unitSize (if no size or sizeUnitSizeMap doesn't exist)
      const currentUnitSize = Number(product.unitSize) || 0;

      if (currentUnitSize <= 0) {
        console.warn(`Product ${productId} has no stock available (unitSize: ${currentUnitSize})`);
        return;
      }

      if (currentUnitSize < quantity) {
        console.warn(`Insufficient stock for product ${productId}. Available: ${currentUnitSize}, Requested: ${quantity}`);
        return;
      }

      const newUnitSize = currentUnitSize - quantity;

      await updateProduct({
        id: productId,
        unitSize: newUnitSize.toString(),
      }).unwrap();

      console.log(`✅ Successfully updated product ${productId} unitSize from ${currentUnitSize} to ${newUnitSize}`);
    } catch (e) {
      console.error(`❌ Error updating product ${productId} unitSize:`, e);
      // Don't throw error as order was successful, but log for debugging
    }
  };

  const onSubmit = async (data: any) => {
    if (selectedProducts.length === 0) {
      alert("Please add at least one product to the bill");
      return;
    }

    const billData = {
      storeId: userId,
      customerName: data.customerName || "",
      customerEmail: data.customerEmail || "",
      customerPhone: data.customerPhone || "",
      products: selectedProducts.map((p) => ({
        quantity: p.quantity,
        price: p.price,
        total: p.total,
        size: p.size || "",
        weight: p.weight || "",
        name: p.name || "",
        photo: p.photo || "",
      })),
      subtotal: calculateSubtotal().toFixed(2),
      discount: getDiscountAmount().toFixed(2), // Discount amount calculated from percentage
      discountPercent: (data.discount || 0).toFixed(2), // Store percentage value
      tax: getTaxAmount().toFixed(2), // Tax amount calculated from percentage
      taxPercent: (data.tax || 0).toFixed(2), // Store percentage value
      total: calculateTotal().toFixed(2),
      notes: data.notes || "",
    };

    try {
      const result = await addBill(billData).unwrap();

      // Update product unitSize (stock) for each product in the bill
      const updatePromises = selectedProducts.map(async (selectedProduct) => {
        try {
          // Find the original product data using productId (not the unique id)
          const storeProduct = products.find((p: any) => p.product?.id === selectedProduct.productId);
          if (!storeProduct || !storeProduct.product) {
            console.warn(`Product with productId ${selectedProduct.productId} not found in products list`);
            return;
          }
          const product = storeProduct.product;

          // Use the helper function to update stock (size-specific or default)
          await updateProductUnitSize(product.id, selectedProduct.quantity, selectedProduct.size);
        } catch (updateError: any) {
          console.error(`Error updating product ${selectedProduct.productId}:`, updateError);
          throw updateError; // Re-throw to handle in Promise.allSettled
        }
      });

      // Wait for all updates to complete (even if some fail)
      const updateResults = await Promise.allSettled(updatePromises);
      const failedUpdates = updateResults.filter(result => result.status === 'rejected').length;

      if (failedUpdates > 0) {
        console.warn(`${failedUpdates} product(s) failed to update stock`);
      }

      // Refetch products to reflect updated stock
      refetchProducts();

      alert(
        failedUpdates === 0
          ? "Bill created successfully and product stock updated!"
          : `Bill created successfully! ${selectedProducts.length - failedUpdates} product(s) stock updated. ${failedUpdates} product(s) failed to update.`
      );
      reset();
      setSelectedProducts([]);
      navigate("/Billing/List");
    } catch (error: any) {
      alert(
        error?.data?.message || "Failed to create bill. Please try again."
      );
    }
  };

  return (
    <div className="mx-2 my-4">
      <div className="flex justify-between items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">Add New Bill</h2>
        <div className="flex gap-2">
          <Button
            color="secondary"
            onClick={handleOpenScanner}
            size="md"
            variant="flat"
            startContent={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H7V7H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 3H21V7H17V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 17H7V21H3V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 17H21V21H17V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 7H17V17H7V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          >
            {isWebSocketConnected ? "📱 Scanner Connected" : "Open Scanner"}
          </Button>
          <Button
            color="default"
            onClick={() => navigate("/Billing/List")}
            size="md"
            variant="flat"
          >
            Back to Bills
          </Button>
        </div>
      </div>

      {/* WebSocket Connection Status */}
      <div className={`mb-4 p-3 rounded-lg border ${isWebSocketConnected
        ? 'bg-success-50 border-success-200 text-success-700'
        : 'bg-warning-50 border-warning-200 text-warning-700'
        }`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isWebSocketConnected ? 'bg-success' : 'bg-warning'}`}></div>
          <span className="text-sm font-medium">
            {isWebSocketConnected
              ? 'Barcode scanner connected - Scan products to auto-fill'
              : 'Barcode scanner not connected - Click "Open Scanner" to connect'}
          </span>
        </div>
        {lastScannedBarcode && (
          <div className="mt-2 text-xs font-mono">
            Last scanned: {lastScannedBarcode}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Barcode Scanner Section */}

            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-4">Select Products</h3>
                <div className="flex gap-2">
                  <div>
                    <ErrorBoundary>
                      <BarcodeScanner
                        onScanSuccess={handleBarcodeScanned}
                        onError={(error) => {
                          console.error('Scanner error:', error);
                        }}
                      />
                    </ErrorBoundary>
                  </div>
                  <div className="flex gap-2 mb-4 w-full">
                    <div className="flex-1">
                      <Autocomplete
                        label="Search and Select Product"
                        placeholder="Type to search products..."
                        selectedKey={
                          selectedProductId ? String(selectedProductId) : null
                        }
                        onSelectionChange={(key) => {
                          setSelectedProductId(key ? Number(key) : null);
                        }}
                        variant="faded"
                        size="sm"
                      >
                        {products.map((storeProduct: any) => {
                          const product = storeProduct.product;
                          if (!product) return null;

                          const displayPrice = storeProduct.price || product.total || product.price || 0;

                          return (
                            <AutocompleteItem
                              key={storeProduct.id}
                              value={storeProduct.id}
                              textValue={product.name}
                            >
                              <div className="flex items-center gap-2">
                                {product.photo && (
                                  <Image
                                    src={product.photo.startsWith('http') ? product.photo : `${infoData.baseApi}/${product.photo}`}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-default-500">
                                    ₹{displayPrice}
                                  </p>
                                </div>
                              </div>
                            </AutocompleteItem>
                          );
                        })}
                      </Autocomplete>
                    </div>
                    <Button
                      color="primary"
                      onClick={handleAddProduct}
                      isDisabled={!selectedProductId}
                      size="lg"
                    >
                      Add Product
                    </Button>
                    {selectedProductId && (
                      <Button
                        color="default"
                        variant="light"
                        onClick={() => setSelectedProductId(null)}
                        size="lg"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>


                {/* Selected Products Table */}
                {selectedProducts.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2">
                      Selected Products ({selectedProducts.length})
                    </h4>
                    <Table aria-label="Selected products table" removeWrapper>
                      <TableHeader>
                        <TableColumn>PRODUCT</TableColumn>
                        <TableColumn>SIZE</TableColumn>
                        <TableColumn>WEIGHT</TableColumn>
                        <TableColumn>PRICE</TableColumn>
                        <TableColumn>QTY</TableColumn>
                        <TableColumn>TOTAL</TableColumn>
                        <TableColumn>ACTION</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {selectedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {product.photo && (
                                  <Image
                                    src={product.photo.startsWith('http') ? product.photo : `${infoData.baseApi}/${product.photo}`}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="rounded object-contain"
                                  />
                                )}
                                <span className="font-medium">
                                  {product.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {(() => {
                                // Determine available sizes
                                const availableSizes = product.sizeUnitSizeMap && Object.keys(product.sizeUnitSizeMap).length > 0
                                  ? Object.keys(product.sizeUnitSizeMap)
                                  : ['No sizes available'];

                                // Find the selected size (case-insensitive)
                                const selectedSize = product.size && product.size.trim() !== ''
                                  ? availableSizes.find(
                                    key => key.toLowerCase() === product.size!.toLowerCase().trim()
                                  ) || null
                                  : null;

                                return (
                                  <div className="flex flex-wrap gap-2 min-w-[200px]">
                                    {availableSizes.map((size) => {
                                      const isSelected = selectedSize?.toLowerCase() === size.toLowerCase();
                                      let sizeLabel = size.toUpperCase();
                                      let sizePrice = "";

                                      // Get size data if available
                                      if (product.sizeUnitSizeMap && product.sizeUnitSizeMap[size]) {
                                        const sizeData = product.sizeUnitSizeMap[size];
                                        const unitSize = sizeData.unitSize || "";
                                        const price = Number(sizeData.price) || Number(sizeData.total) || Number(sizeData.grandTotal) || 0;

                                        if (unitSize) {
                                          sizeLabel = `${size.toUpperCase()}: ${unitSize}`;
                                        }
                                        if (price > 0) {
                                          sizePrice = `₹${price}`;
                                        }
                                      }

                                      return (
                                        <button
                                          key={size}
                                          type="button"
                                          onClick={() => handleSizeChange(product.id, size)}
                                          className={`
                                            px-3 py-1.5 rounded border-2 transition-all text-xs font-medium
                                            ${isSelected
                                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                                              : 'border-dashed border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                                            }
                                            min-w-[60px] text-center
                                          `}
                                        >
                                          <div className="flex flex-col items-center">
                                            <span>{sizeLabel}</span>
                                            {sizePrice && (
                                              <span className="text-[10px] mt-0.5">{sizePrice}</span>
                                            )}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text"
                                value={product.weight || ""}
                                onChange={(e) =>
                                  handleWeightChange(
                                    product.id,
                                    e.target.value
                                  )
                                }
                                placeholder="Weight"
                                size="sm"
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={String(product.price)}
                                onChange={(e) =>
                                  handlePriceChange(
                                    product.id,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                size="sm"
                                min="0"
                                step="0.01"
                                className="w-24"
                                key={`price-${product.id}-${product.price}`} // Force re-render when price changes
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={String(product.quantity)}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    product.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                size="sm"
                                min="1"
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">
                                ₹{product.total.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                color="danger"
                                size="sm"
                                variant="light"
                                onClick={() => handleRemoveProduct(product.id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Customer Info & Summary */}
          <div className="space-y-4">
            {/* Customer Information */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-4">
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <Controller
                    name="customerName"
                    control={control}
                    rules={{ required: "Customer name is required" }}
                    render={({ field }) => (
                      <InputNextUI
                        label="Customer Name"
                        isRequired
                        isInvalid={!!errors.customerName}
                        errorMessage={errors.customerName?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="customerEmail"
                    control={control}
                    render={({ field }) => (
                      <InputNextUI
                        label="Customer Email"
                        type="email"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="customerPhone"
                    control={control}
                    render={({ field }) => (
                      <InputNextUI
                        label="Customer Phone"
                        type="tel"
                        {...field}
                      />
                    )}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Bill Summary */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-4">Bill Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-default-600">Subtotal:</span>
                    <span className="font-semibold">
                      ₹{calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <Controller
                    name="discount"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <InputNextUI
                            label="Discount (%)"
                            type="number"
                            {...field}
                            onChange={(value) => {
                              const numValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
                              field.onChange(numValue);
                              setValue("discount", numValue);
                            }}
                          />
                        </div>
                        {field.value > 0 && (
                          <div className="text-xs text-default-500 pl-2">
                            Discount Amount: ₹{getDiscountAmount().toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="tax"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <InputNextUI
                            label="Tax (%)"
                            type="number"
                            {...field}
                            onChange={(value) => {
                              const numValue = Math.max(0, parseFloat(value) || 0);
                              field.onChange(numValue);
                              setValue("tax", numValue);
                            }}
                          />
                        </div>
                        {field.value > 0 && (
                          <div className="text-xs text-default-500 pl-2">
                            Tax Amount: ₹{getTaxAmount().toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  />
                  <Divider />
                  <div className="space-y-2">
                    {watch("discount") > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-default-600">Discount ({watch("discount")}%):</span>
                        <span className="font-medium text-danger">
                          -₹{getDiscountAmount().toFixed(2)}
                        </span>
                      </div>
                    )}
                    {watch("tax") > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-default-600">Tax ({watch("tax")}%):</span>
                        <span className="font-medium text-success">
                          +₹{getTaxAmount().toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg pt-2 border-t">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-primary">
                        ₹{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Notes */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-4">Notes</h3>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TeaxtareaNextUI
                      {...field}
                      placeholder="Add any additional notes..."
                      variant="bordered"
                      size="md"
                    />
                  )}
                />
              </CardBody>
            </Card>

            {/* Submit Button */}
            <Button
              color="primary"
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              isDisabled={selectedProducts.length === 0}
            >
              {isSubmitting ? "Creating Bill..." : "Create Bill"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBill;

