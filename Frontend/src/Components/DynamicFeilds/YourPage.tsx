import {
  Button,
  Checkbox,
  CheckboxGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Radio,
  RadioGroup,
  Textarea,
} from "@nextui-org/react";
import React from "react";

const DynamicComponent = ({ fieldType }) => {
  let dynamicField;

  switch (fieldType) {
    case "text":
      dynamicField = <Input type="text" placeholder="Enter text" />;
      break;
    case "number":
      dynamicField = <Input type="number" placeholder="Enter number" />;
      break;
    case "email":
      dynamicField = <Input type="email" placeholder="Enter email" />;
      break;
    case "textarea":
      dynamicField = (
        <Textarea
          label="Description"
          placeholder="Enter your description"
          className="max-w-xs"
        />
      );
      break;
    case "dropdown":
      dynamicField = (
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Open Menu</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">New file</DropdownItem>
            <DropdownItem key="copy">Copy link</DropdownItem>
            <DropdownItem key="edit">Edit file</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
              Delete file
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      break;
    case "checkbox":
      dynamicField = (
        <CheckboxGroup
          label="Select cities"
          defaultValue={["buenos-aires", "london"]}
        >
          <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
          <Checkbox value="sydney">Sydney</Checkbox>
          <Checkbox value="san-francisco">San Francisco</Checkbox>
          <Checkbox value="london">London</Checkbox>
          <Checkbox value="tokyo">Tokyo</Checkbox>
        </CheckboxGroup>
      );
      break;
    case "date":
      dynamicField = <Input type="date" />;
      break;
    case "radio":
      dynamicField = (
        <div>
          <RadioGroup label="Select your favorite city">
            <Radio value="buenos-aires">Buenos Aires</Radio>
            <Radio value="sydney">Sydney</Radio>
            <Radio value="san-francisco">San Francisco</Radio>
            <Radio value="london">London</Radio>
            <Radio value="tokyo">Tokyo</Radio>
          </RadioGroup>
        </div>
      );
      break;
    // Add more cases for other field types as needed

    default:
      dynamicField = <p>Invalid field type</p>;
  }

  return (
    <div>
      {dynamicField}
      {/* Additional code or components can be added here */}
    </div>
  );
};

const YourPage = () => {
  // Replace 'text', 'number', 'email', 'textarea', 'dropdown', 'checkbox', 'date', 'radio', etc. with the actual field type you want to render
  const fieldTypeToRender = "dropdown";

  return (
    <div>
      <h1>Dynamic Field Rendering</h1>
      <DynamicComponent fieldType={fieldTypeToRender} />
      {/* Additional code or components can be added here */}
    </div>
  );
};

export default YourPage;
