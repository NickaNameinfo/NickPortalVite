import { Button, Input } from "@nextui-org/react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

interface FieldTypes {
  name: string;
  label: string;
  key: any;
  type: string;
  labelPlacement?: any;
  color?: any;
  variant?: any;
}

type OnSubmitHandler = (data: Record<string, any>) => void;
interface DynamicFormProps {
  fields: FieldTypes[];
  onSubmit: OnSubmitHandler;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit }) => {
  const { control, handleSubmit, setValue } = useForm();

  const renderFormField = (item: FieldTypes, index:any) => {
    switch (item.type) {
      case "text":
        return (
          <Controller
            key={item.key}
            name={`items.${item.key}.value`}
            control={control}
            rules={{
              required: "This field is required",
              minLength: {
                value: 3,
                message: "Minimum length is 3 characters",
              },
              maxLength: {
                value: 20,
                message: "Maximum length is 20 characters",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  classNames={{
                    input: [
                      "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                  }}
                  {...item}
                  type={"text"}
                  errorMessage={fieldState?.error?.message}
                />
                {/* {fieldState.error && <p>{fieldState.error.message}</p>} */}
              </>
            )}
          />
        );
      case "email":
        return (
          <Controller
            key={item.key}
            name={`items.${item.key}.value`}
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  classNames={{
                    input: [
                      "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                  }}
                  {...item}
                  type={"email"}
                  errorMessage={fieldState?.error?.message}
                />
                {/* {fieldState.error && <p>{fieldState.error.message}</p>} */}
              </>
            )}
          />
        );
      case "number":
        return (
          <Controller
            key={item.key}
            name={`items.${item.key}.value`}
            control={control}
            rules={{
              required: "Number is required",
              min: {
                value: 1,
                message: "Value must be greater than or equal to 1",
              },
              max: {
                value: 100,
                message: "Value must be less than or equal to 100",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  classNames={{
                    input: [
                      "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                  }}
                  {...item}
                  type={"number"}
                  errorMessage={fieldState?.error?.message}
                />
                {/* {fieldState.error && <p>{fieldState.error.message}</p>} */}
              </>
            )}
          />
        );
      case "date":
        return (
          <Controller
            key={item.key}
            name={`items.${item.key}.value`}
            control={control}
            rules={{
              required: "Date is required",
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: "Invalid date format (YYYY-MM-DD)",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  classNames={{
                    input: [
                      "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                  }}
                  {...item}
                  type={"date"}
                  errorMessage={fieldState?.error?.message}
                />
              </>
            )}
          />
        );
      default:
        return null;
    }
  };

  const onClickSubmit = (data:any) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onClickSubmit)}>
      {fields?.map((result, index) => renderFormField(result, index))}
      <Button type="submit" variant="bordered" color="primary" className="mt-3">
        Submit
      </Button>
    </form>
  );
};

export default DynamicForm;
