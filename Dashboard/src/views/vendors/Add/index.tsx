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
import { useAddVendorsMutation } from "../Service.mjs";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const { handleSubmit, control, reset } = useForm();
  const navigate = useNavigate();
  const [addVendors] = useAddVendorsMutation();

  const onSubmit = async (data: any) => {
    let tempAPI = {
      ...data,
      areaId: 1,
    };
    console.log("datafrom data form", tempAPI);
    const result = await addVendors(tempAPI);
    if (result?.data?.success) {
      navigate("/Vendors/List");
    }
    console.log(data, "datadatadatadatadata", result);
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
              <Input type="text" label="Store Name" size="lg" {...field} />
            )}
          />
          <Controller
            name="status" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Select label="Select an Status" {...field}>
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
              <Input type="number" label="Phone Number" size="lg" {...field} />
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
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Add;
