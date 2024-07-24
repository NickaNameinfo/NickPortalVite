import {
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  Input,
  Select,
  SelectItem,
  Button,
  Textarea,
} from "@nextui-org/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  useAddVendorsMutation,
  useGetVendorsByIDQuery,
  useUpdateVendorsMutation,
} from "../Service.mjs";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import InputNextUI from "../../../Components/Common/Input/input";

const Add = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const formData = watch();
  console.log(formData, "Form data");

  const navigate = useNavigate();
  const [addVendors] = useAddVendorsMutation();
  const [updateVendors] = useUpdateVendorsMutation();
  const { id, type } = useParams();
  const { data, error, refetch } = useGetVendorsByIDQuery(id ? id : null);

  React.useEffect(() => {
    if (data?.data.length > 0) {
      reset(data?.data?.[0]);
      setValue("status", data?.data?.[0]?.status.toString());
      setValue("adharCardNo", Number(data?.data?.[0]?.adharCardNo));
    } else {
    }
  }, [data]);

  React.useEffect(() => {
    if (type === "Add") {
      reset();
    }
  }, [type]);

  const onSubmit = async (data: any) => {
    let tempAPI = {
      ...data,
      areaId: 1,
      adharCardNo: Number(data?.adharCardNo),
    };
    console.log("datafrom data form", tempAPI);
    if (id) {
      const result = await updateVendors(tempAPI);
      if (result?.data?.success) {
        navigate("/Vendors/List");
      }
    } else {
      const result = await addVendors(tempAPI);
      if (result?.data?.success) {
        navigate("/Vendors/List");
      }
      console.log(data, "datadatadatadatadata", result);
    }
  };
  const animals = [
    { key: "cat", label: "Cat" },
    { key: "dog", label: "Dog" },
    { key: "elephant", label: "Elephant" },
    { key: "lion", label: "Lion" },
    { key: "tiger", label: "Tiger" },
    { key: "giraffe", label: "Giraffe" },
    { key: "dolphin", label: "Dolphin" },
    { key: "penguin", label: "Penguin" },
    { key: "zebra", label: "Zebra" },
    { key: "shark", label: "Shark" },
    { key: "whale", label: "Whale" },
    { key: "otter", label: "Otter" },
    { key: "crocodile", label: "Crocodile" },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col flex-wrap gap-4 border-b pb-2 mb-3">
        <Chip color="secondary" variant="dot" className="bg-warning-50">
          Vendor Register
        </Chip>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <Controller
            name="storename" // Changed to reflect a text input
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // <Input type="text" label="Store Name" size="lg" {...field} />
              <InputNextUI
                isRequired
                labelPlacement="inside"
                color="default"
                variant="flat"
                type="text"
                label="Store Name"
                size="md"
                onChange={(value) => {
                  console.log(value, "storename");
                }}
                {...field}
              />
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
            name="shopaddress" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Textarea label="Shop Address" size="lg" {...field} />
            )}
          />
          <Controller
            name="shopdesc" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Textarea label="Discription" size="lg" {...field} />
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
              // <Input type="text" label="Owner Name" size="lg" {...field} />
              <InputNextUI
                isRequired
                labelPlacement="inside"
                color="default"
                variant="flat"
                type="text"
                label="Owner Name"
                size="md"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="email" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="email" label="Email" size="lg" {...field} />
              <InputNextUI
                isRequired
                labelPlacement="inside"
                color="default"
                variant="flat"
                type="email"
                label="Email"
                size="md"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="password" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="password" label="Password" size="lg" {...field} />
              <InputNextUI
                isRequired
                labelPlacement="inside"
                color="default"
                variant="flat"
                type="password"
                label="Password"
                size="md"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="phone" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="number" label="Phone Number" size="lg" {...field} />
              <InputNextUI
                isRequired
                labelPlacement="inside"
                color="default"
                variant="flat"
                type="number"
                label="Phone Number"
                size="md"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
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
              // <Input
              //   type="number"
              //   label="Accoutn Number"
              //   size="lg"
              //   {...field}
              // />
              <InputNextUI
                isRequired
                labelPlacement="inside"
                color="default"
                variant="flat"
                type="number"
                label="Accoutn Number"
                size="md"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="accountHolderName" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input
              //   type="text"
              //   label="Accoutn Holder Name"
              //   size="lg"
              //   {...field}
              // />
              <InputNextUI
                isRequired
                labelPlacement="inside"
                color="default"
                variant="flat"
                type="text"
                label="Accoutn Holder Name"
                size="md"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="IFSC" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="IFSC" size="lg" {...field} />
              <InputNextUI
                isRequired
                labelPlacement="inside"
                color="default"
                variant="flat"
                type="text"
                label="IFSC"
                size="md"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="bankName" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="Bank Name" size="lg" {...field} />
              <InputNextUI
                isRequired
                labelPlacement="inside"
                color="default"
                variant="flat"
                type="text"
                label="Bank Name"
                size="md"
                onChange={(value) => {
                  console.log(value, "ownername");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="branch" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="Branch" size="lg" {...field} />
              <InputNextUI
                isRequired
                labelPlacement="inside"
                color="default"
                variant="flat"
                type="text"
                label="Branch"
                size="md"
                onChange={(value) => {
                  console.log(value, "Branch");
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="adharCardNo" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="Aadhar Number" size="lg" {...field} />
              <InputNextUI
              isRequired
              labelPlacement="inside"
              color="default"
              variant="flat"
              type="text"
              label="Aadhar Number"
              size="md"
              onChange={(value) => {
                console.log(value, "Aadhar_Number");
              }}
              {...field}
            />
            )}
          />
          <Controller
            name="panCardNo" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="PAN Number" size="lg" {...field} />
              <InputNextUI
              isRequired
              labelPlacement="inside"
              color="default"
              variant="flat"
              type="text"
              label="PAN Number"
              size="md"
              onChange={(value) => {
                console.log(value, "PAN_Number");
              }}
              {...field}
            />
            )}
          />
          <Controller
            name="GSTNo" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              // <Input type="text" label="GST No" size="lg" {...field} />
              <InputNextUI
              isRequired
              labelPlacement="inside"
              color="default"
              variant="flat"
              type="text"
              label="GST"
              size="md"
              onChange={(value) => {
                console.log(value, "GST");
              }}
              {...field}
            />
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
  );
};

export default Add;
