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
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import InputNextUI from "../../Components/Common/Input/input";
import TeaxtareaNextUI from "../../Components/Common/Input/Textarea";
import { infoData } from "../../configData";

interface SelectedProduct {
  id: number;
  name: string;
  photo?: string;
  price: number;
  quantity: number;
  total: number;
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
  const [selectedProducts, setSelectedProducts] = React.useState<
    SelectedProduct[]
  >([]);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);

  const {
    data: productsData,
    refetch: refetchProducts,
  } = useGetStoresProductByIDQuery(Number(storeId), { skip: !storeId , refetchOnMountOrArgChange: true});

  const products = productsData?.data || [];

  const handleAddProduct = () => {
    if (!selectedProductId) return;

    const storeProduct = products.find((p: any) => p.id === selectedProductId);
    if (!storeProduct || !storeProduct.product) return;

    const product = storeProduct.product;

    // Check if product already added
    if (selectedProducts.some((p) => p.id === selectedProductId)) {
      alert("Product already added to the bill");
      return;
    }

    // Use store product price if available, otherwise use product total
    const productPrice = storeProduct.price || product.total || product.price || 0;

    const newProduct: SelectedProduct = {
      id: storeProduct.id,
      name: product.name,
      photo: product.photo,
      price: productPrice,
      quantity: 1,
      total: productPrice,
    };

    setSelectedProducts([...selectedProducts, newProduct]);
    setSelectedProductId(null);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.id !== productId)
    );
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

  const calculateSubtotal = () => {
    return selectedProducts.reduce((sum, product) => sum + product.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = watch("discount") || 0;
    const tax = watch("tax") || 0;
    return subtotal - discount + tax;
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
      products: selectedProducts,
      subtotal: calculateSubtotal().toFixed(2),
      discount: (data.discount || 0).toFixed(2),
      tax: (data.tax || 0).toFixed(2),
      total: calculateTotal().toFixed(2),
      notes: data.notes || "",
    };

    try {
      const result = await addBill(billData).unwrap();
      alert("Bill created successfully!");
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
        <Button
          color="default"
          onClick={() => navigate("/Billing/List")}
          size="md"
          variant="flat"
        >
          Back to Bills
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-4">Select Products</h3>
                <div className="flex gap-2 mb-4">
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
                                    className="rounded object-cover"
                                  />
                                )}
                                <span className="font-medium">
                                  {product.name}
                                </span>
                              </div>
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
                      <div className="flex items-center gap-2">
                        <InputNextUI
                          label="Discount"
                          type="number"
                          min="0"
                          {...field}
                          onChange={(value) => {
                            field.onChange(value);
                            setValue("discount", parseFloat(value) || 0);
                          }}
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="tax"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <InputNextUI
                          label="Tax"
                          type="number"
                          min="0"
                          {...field}
                          onChange={(value) => {
                            field.onChange(value);
                            setValue("tax", parseFloat(value) || 0);
                          }}
                        />
                      </div>
                    )}
                  />
                  <Divider />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary">
                      ₹{calculateTotal().toFixed(2)}
                    </span>
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

