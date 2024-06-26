import {
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  Input,
  Select,
  SelectItem,
  Button,
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
      address_id: 1,
      tax_id: 1,
    };
    console.log("datafrom data form", tempAPI);
    const formData = new FormData();
    for (const key in tempAPI) {
      formData.append(key, tempAPI[key]);
      console.log(formData);
    }
    const result = await addVendors(formData);
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
            name="vendor_name" // Changed to reflect a text input
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input type="text" label="Name" size="lg" {...field} />
            )}
          />
          <Controller
            name="contact_person" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Input type="text" label="Contact Person" size="lg" {...field} />
            )}
          />
          <Controller
            name="email_address" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Input type="email" label="Email" size="lg" {...field} />
            )}
          />
          <Controller
            name="phone_number" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Input type="number" label="Phone Number" size="lg" {...field} />
            )}
          />
          <Controller
            name="alternative_number" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                label="Alternative Number"
                size="lg"
                {...field}
              />
            )}
          />
          <Controller
            name="payment_terms" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Input type="url" label="Payment Terms" size="lg" {...field} />
            )}
          />
          <Controller
            name="preferred_currency" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Select label="Select an animal" {...field}>
                {animals.map((animal) => (
                  <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
              </Select>
            )}
          />
          <Controller
            name="services_provided" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Select label="Select an animal" {...field}>
                {animals.map((animal) => (
                  <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
              </Select>
            )}
          />
          <Controller
            name="total_stores" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Input type="number" label="Total Stores" size="lg" {...field} />
            )}
          />
          <Controller
            name="number_category" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                label="Category Count"
                size="lg"
                {...field}
              />
            )}
          />
          <Controller
            name="status" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Select label="Select an Status" {...field}>
                {animals.map((animal) => (
                  <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
              </Select>
            )}
          />
          <Controller
            name="vendor_image" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Input
                type="file"
                color="primary"
                variant="bordered"
                onChange={(e) => {
                  field.onChange(e.target.files[0]); // Don't forget to call field.onChange to update the form state
                }}
              />
            )}
          />
          <Controller
            name="vendor_document" // Changed to reflect a text input
            control={control}
            render={({ field }) => (
              <Input
                type="file"
                color="primary"
                variant="bordered"
                onChange={(e) => {
                  field.onChange(e.target.files[0]); // Don't forget to call field.onChange to update the form state
                }}
              />
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
