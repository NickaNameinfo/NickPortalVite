import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Image,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { useGetProductsByIdQuery } from "./Service.mjs";
import JsBarcode from "jsbarcode";
import { useAppSelector } from "../../Common/hooks";

const ScanBarcode = () => {
  const navigate = useNavigate();
  const [scannedId, setScannedId] = React.useState<string>("");
  const [productId, setProductId] = React.useState<string | number | null>(null);
  const [isScanning, setIsScanning] = React.useState<boolean>(false);

  const {
    data: productData,
    error: productError,
    isLoading: isLoadingProduct,
  } = useGetProductsByIdQuery(productId, {
    skip: !productId,
    refetchOnMountOrArgChange: true,
  });

  const handleScan = () => {
    if (scannedId.trim()) {
      setProductId(scannedId.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  const handleClear = () => {
    setScannedId("");
    setProductId(null);
  };

  return (
    <div className="mx-3 my-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Scan Barcode</h1>
        <Button
          color="default"
          variant="flat"
          onClick={() => navigate("/ProductsList")}
        >
          Back to Products
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">Enter Product ID</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Scan or enter product ID"
              value={scannedId}
              onChange={(e) => setScannedId(e.target.value)}
              onKeyPress={handleKeyPress}
              size="lg"
              className="flex-1"
              autoFocus
            />
            <Button
              color="primary"
              onClick={handleScan}
              isDisabled={!scannedId.trim()}
            >
              Search
            </Button>
            {productId && (
              <Button color="default" variant="flat" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Tip: Scan the barcode with your mobile device and enter the product
            ID here, or type the product ID manually.
          </p>
        </CardBody>
      </Card>

      {isLoadingProduct && (
        <Card>
          <CardBody className="flex justify-center items-center py-8">
            <Spinner size="lg" />
            <p className="mt-4">Loading product details...</p>
          </CardBody>
        </Card>
      )}

      {productError && (
        <Card>
          <CardBody>
            <div className="text-center py-4">
              <p className="text-red-500">
                Product not found. Please check the product ID and try again.
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {productData?.data && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Product Details</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {productData.data.photo && (
                  <Image
                    src={productData.data.photo}
                    alt={productData.data.name}
                    className="w-full h-auto rounded-lg mb-4"
                  />
                )}
                <div className="mb-4">
                  <BarcodeDisplay productData={productData.data} />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Product Name
                  </label>
                  <p className="text-lg">{productData.data.name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Description
                  </label>
                  <p className="text-sm">{productData.data.sortDesc || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Price
                  </label>
                  <p className="text-lg font-bold text-primary">
                    ₹{productData.data.total || productData.data.price || "0"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Quantity
                  </label>
                  <p className="text-lg">{productData.data.qty || "0"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Unit Size
                  </label>
                  <p className="text-lg">{productData.data.unitSize || "N/A"}</p>
                </div>
                {productData.data.size && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Size
                    </label>
                    <p className="text-lg">{productData.data.size}</p>
                  </div>
                )}
                {productData.data.weight && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Weight
                    </label>
                    <p className="text-lg">{productData.data.weight}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Status
                  </label>
                  <Chip
                    color={productData.data.status === "1" ? "success" : "danger"}
                    variant="flat"
                  >
                    {productData.data.status === "1" ? "Active" : "Inactive"}
                  </Chip>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Product ID
                  </label>
                  <p className="text-lg font-mono">{productData.data.id}</p>
                </div>
                <div className="pt-4">
                  <Button
                    color="primary"
                    onClick={() => navigate(`/AddProducts/${productData.data.id}`)}
                  >
                    Edit Product
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

// Barcode Display Component with Label Design
const BarcodeDisplay = ({ productData }: { productData: any }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const productIdStr = String(productData?.id || "");
  const productName = productData?.name || "Product";
  const currentloginDetails = useAppSelector(
    (state) => state.globalConfig.currentloginDetails
  );

  // Parse sizeUnitSizeMap to get size-specific data
  const [sizeData, setSizeData] = React.useState<{
    size: string;
    price: number;
  } | null>(null);

  React.useEffect(() => {
    if (productData?.sizeUnitSizeMap) {
      try {
        const parsed = typeof productData.sizeUnitSizeMap === 'string'
          ? JSON.parse(productData.sizeUnitSizeMap)
          : productData.sizeUnitSizeMap;
        
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          // Get first size entry
          const firstSizeKey = Object.keys(parsed)[0];
          const firstSizeData = parsed[firstSizeKey];
          
          if (firstSizeData && typeof firstSizeData === 'object') {
            // Prioritize total/grandTotal (discounted price) over price
            const sizePrice = Number(firstSizeData.total) || 
                            Number(firstSizeData.grandTotal) || 
                            Number(firstSizeData.price) || 
                            0;
            
            setSizeData({
              size: firstSizeKey.toUpperCase(),
              price: sizePrice > 0 ? sizePrice : (Number(productData.price) || Number(productData.total) || 0),
            });
          } else {
            // Fallback if size data is not an object
            setSizeData({
              size: firstSizeKey.toUpperCase(),
              price: Number(productData.price) || Number(productData.total) || 0,
            });
          }
        } else {
          // No size data, use product defaults
          setSizeData({
            size: productData?.size || "N/A",
            price: Number(productData.price) || Number(productData.total) || 0,
          });
        }
      } catch (e) {
        console.warn('Failed to parse sizeUnitSizeMap:', e);
        // Fallback to product defaults
        setSizeData({
          size: productData?.size || "N/A",
          price: Number(productData.price) || Number(productData.total) || 0,
        });
      }
    } else {
      // No sizeUnitSizeMap, use product defaults
      setSizeData({
        size: productData?.size || "N/A",
        price: Number(productData.price) || Number(productData.total) || 0,
      });
    }
  }, [productData]);

  const productMRP = sizeData?.price || productData?.price || productData?.total || "0";
  const productSize = sizeData?.size || productData?.size || "N/A";
  const productColor = productData?.color || "N/A";

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
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm font-semibold text-gray-600 mb-2">Product Label</div>
      <div 
        className="bg-white border-2 border-black p-3"
        style={{
          width: '90mm',
          height: 'auto',
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
            <div className="font-bold text-lg">{currentloginDetails?.data?.firstName || "STORE"}</div>
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

export default ScanBarcode;
