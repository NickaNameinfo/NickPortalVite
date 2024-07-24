import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetStoreAreaQuery,
  useAddStoreMutation,
  useGetStoresByIDQuery,
  useUpdateStoreMutation,
} from "./Service.mjs";

const AddStore = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const currentLocation = useLocation();
  const parts = currentLocation.pathname.split("/");
  console.log(parts?.[2], "ajsdfhiuiuwert");

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const formData = watch();
  console.log(formData, "formDatatest");
  const { data: Area, error, refetch } = useGetStoreAreaQuery();
  const [addStores] = useAddStoreMutation();
  const {
    data: getStoreByID,
    error: errorStoreID,
    refetch: refetchStoreID,
  } = useGetStoresByIDQuery(id ? id : null);
  console.log(getStoreByID, "getStoreByIDkmsdfosfjl");

  const [updateStores] = useUpdateStoreMutation();

  React.useEffect(() => {
    if (getStoreByID?.data.length > 0) {
      const areaIds = getStoreByID?.data?.[0]?.areaId;
      const statusIds = getStoreByID?.data?.[0]?.status;
      reset(getStoreByID?.data?.[0]);
      setValue("status", statusIds.toString());
      setValue("adharCardNo", Number(getStoreByID?.data?.[0]?.adharCardNo));
      setValue("areaId", areaIds.toString());
    } else {
    }
  }, [getStoreByID]);

  React.useEffect(() => {
    if (parts?.[2] === "Add") {
      reset();
    }
  }, []);

  const onSubmit = async (data: any) => {
    if (id) {
      const result = await updateStores(data);
      if (result?.data?.success) {
        navigate("/Vendors/List");
      }
    } else {
      const result = await addStores(data);
      console.log(result, "addStores");

      if (result?.data?.success) {
        navigate("/Stores/List");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-wrap gap-4 border-b pb-2 mb-3">
          <Chip color="secondary" variant="dot" className="bg-warning-50">
            Store Register
          </Chip>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Controller
              name="storename"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="Store Name" size="lg" {...field} />
              )}
            />
            <Controller
              name="status" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Select
                  label="Select an Status"
                  {...field}
                  selectedKeys={formData?.status}
                >
                  <SelectItem key={1}>{"Active"}</SelectItem>
                  <SelectItem key={0}>{"InActive"}</SelectItem>
                </Select>
              )}
            />
            <Controller
              name="storeaddress" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Textarea label="Shop Address" size="lg" {...field} />
              )}
            />
            <Controller
              name="storedesc" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Textarea label="Description" size="lg" {...field} />
              )}
            />
            <div className="flex flex-col flex-wrap gap-4 border-b pb-2 mb-3">
              <Chip color="secondary" variant="dot" className="bg-warning-50">
                Owner Details
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <Controller
              name="ownername" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input type="text" label="Owner Name" size="lg" {...field} />
              )}
            />
            <Controller
              name="email" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input type="email" label="Email" size="lg" {...field} />
              )}
            />
            <Controller
              name="password" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input type="password" label="Password" size="lg" {...field} />
              )}
            />
            <Controller
              name="phone" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Phone Number"
                  size="lg"
                  {...field}
                />
              )}
            />
            <Controller
              name="areaId" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Select
                  label="Select an Area"
                  {...field}
                  selectedKeys={formData?.areaId}
                >
                  {Area?.data?.map((item) => (
                    <SelectItem key={item.id}>{item.name}</SelectItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="storeImage" // Changed to reflect a text input
              control={control}
              //   rules={{ required: true }}
              render={({ field }) => (
                <Input
                  type="file"
                  label="Image"
                  size="lg"
                  onChange={(e) => {
                    field.onChange(e.target.files[0]); // Don't forget to call field.onChange to update the form state
                  }}
                />
              )}
            />
            <Controller
              name="owneraddress" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Textarea label="Owner Address" size="lg" {...field} />
              )}
            />
            <Controller
              name="website" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Textarea label="Owner Website" size="lg" {...field} />
              )}
            />
            <Controller
              name="openTime" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Textarea label="Shop Open Time" size="lg" {...field} />
              )}
            />
            <Controller
              name="closeTime" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Textarea label="Shop Close Time" size="lg" {...field} />
              )}
            />
          </div>
          <div className="flex flex-col flex-wrap gap-4 border-b pb-2 mb-3">
            <Chip color="danger" variant="dot" className="bg-warning-50">
              Bank Details(Optional)
            </Chip>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Controller
              name="accountNo" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Accoutn Number"
                  size="lg"
                  {...field}
                />
              )}
            />
            <Controller
              name="accountHolderName" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  label="Accoutn Holder Name"
                  size="lg"
                  {...field}
                />
              )}
            />
            <Controller
              name="IFSC" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input type="text" label="IFSC" size="lg" {...field} />
              )}
            />
            <Controller
              name="bankName" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input type="text" label="Bank Name" size="lg" {...field} />
              )}
            />
            <Controller
              name="branch" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input type="text" label="Branch" size="lg" {...field} />
              )}
            />
            <Controller
              name="adharCardNo" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input type="text" label="Aadhar Number" size="lg" {...field} />
              )}
            />
            <Controller
              name="panCardNo" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input type="text" label="PAN Number" size="lg" {...field} />
              )}
            />
            <Controller
              name="GSTNo" // Changed to reflect a text input
              control={control}
              render={({ field }) => (
                <Input type="text" label="GST No" size="lg" {...field} />
              )}
            />
          </div>
          <div className="text-center">
            <Button color="primary" type="submit">
              {id ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStore;
