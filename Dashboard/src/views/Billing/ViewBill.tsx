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
} from "@nextui-org/react";
import React from "react";
import { useGetBillByIdQuery } from "./Service.mjs";
import { infoData } from "../../configData";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { useGetStoresByIDQuery } from "../Store/Service.mjs";

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

  const storeId = getCookie("storeId");
  const { data: storeData, error: storeError, refetch: storeRefetch } = useGetStoresByIDQuery(
    Number(storeId), { skip: !storeId , refetchOnMountOrArgChange: true}
  );

  const store = storeData?.data || null;

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

  const handlePrint = () => {
    window.print();
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
        <div className="flex gap-2">
          {/* <Button color="primary" onClick={handleDownload} variant="flat">
            Download PDF
          </Button> */}
          <Button color="primary" onClick={handlePrint} variant="flat">
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Container */}
      <Card className="print:shadow-none print:border-0 print-only">
        <CardBody className="p-8 print:p-6">
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
        </CardBody>
      </Card>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 1cm;
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
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: none !important;
          }
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
          .print\\:mb-6 {
            margin-bottom: 1.5rem !important;
          }
          .print\\:mt-6 {
            margin-top: 1.5rem !important;
          }
          .print\\:mx-0 {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .print\\:my-0 {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewBill;

