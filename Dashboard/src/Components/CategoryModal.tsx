import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
  Tabs,
  Tab,
  Spinner,
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { useGetCategoriesQuery, useAddCategoriesMutation } from "../views/Categories/Service.mjs";
import { getCookie } from "../JsFiles/CommonFunction.mjs";
import InputNextUI from "./Common/Input/input";

interface CategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategoryId?: string | number | null;
  onCategorySelect?: (categoryId: number | null) => void;
  label?: string;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onOpenChange,
  selectedCategoryId,
  onCategorySelect,
  label = "Select Category",
}) => {
  const [activeTab, setActiveTab] = React.useState<string>("select");
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const id = getCookie("id");

  const {
    data: categoryData,
    error: categoryError,
    refetch: categoryRefetch,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();

  const [addCategories, { isLoading: isAddingCategory }] = useAddCategoriesMutation();

  // Form for adding new category
  const {
    handleSubmit: handleAddCategory,
    control: addCategoryControl,
    reset: resetAddForm,
    formState: { errors: addCategoryErrors },
  } = useForm();

  // Internal state for selected category
  const [internalSelectedCategoryId, setInternalSelectedCategoryId] = React.useState<number | null>(
    selectedCategoryId !== undefined && selectedCategoryId !== null 
      ? Number(selectedCategoryId) 
      : null
  );

  // Sync internal state with prop
  React.useEffect(() => {
    if (selectedCategoryId !== undefined && selectedCategoryId !== null) {
      setInternalSelectedCategoryId(Number(selectedCategoryId));
    }
  }, [selectedCategoryId]);

  // Handle category selection
  const handleCategorySelection = (selectedKey: any) => {
    const valueToSave = selectedKey === null ? null : Number(selectedKey);
    setInternalSelectedCategoryId(valueToSave);
  };

  // Handle add new category
  const onAddCategorySubmit = async (formData: any) => {
    try {
      const tempApiParams = {
        ...formData,
        slug: formData.name,
        createdId: id ? id : vendorId ? vendorId : storeId,
        createdType: vendorId ? "Vendor" : "Store",
      };
      const result = await addCategories(tempApiParams);
      if (result?.data?.success) {
        alert("Category added successfully");
        resetAddForm();
        // Refetch categories
        const refetchResult = await categoryRefetch();
        // Switch to select tab
        setActiveTab("select");
        // Find and select the newly added category
        if (refetchResult?.data?.data) {
          const newCategory = refetchResult.data.data.find(
            (cat: any) => cat.name === formData.name
          );
          if (newCategory) {
            const newCategoryId = Number(newCategory.id);
            setInternalSelectedCategoryId(newCategoryId);
            if (onCategorySelect) {
              onCategorySelect(newCategoryId);
            }
          }
        }
      } else {
        alert(result?.error?.data?.message || "Failed to add category");
      }
    } catch (error: any) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {label}
            </ModalHeader>
            <ModalBody>
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                aria-label="Category options"
              >
                <Tab key="select" title="Select Category">
                  <div className="mt-4">
                    {categoriesLoading ? (
                      <div className="flex justify-center py-4">
                        <Spinner size="sm" />
                      </div>
                    ) : (
                      <Autocomplete
                        label="Select Category"
                        variant="faded"
                        size="sm"
                        placeholder="Search or select a category"
                        selectedKey={internalSelectedCategoryId ? String(internalSelectedCategoryId) : null}
                        onSelectionChange={handleCategorySelection}
                        listboxProps={{
                          itemClasses: {
                            base: [
                              "rounded-md",
                              "text-default-500",
                              "transition-opacity",
                              "data-[hover=true]:text-foreground",
                              "data-[hover=true]:bg-default-100",
                              "dark:data-[hover=true]:bg-default-50",
                              "data-[selectable=true]:focus:bg-default-50",
                              "data-[pressed=true]:opacity-90",
                              "data-[focus-visible=true]:ring-default-500",
                              "shadow-none",
                            ],
                          },
                        }}
                        defaultFilter={(textValue, inputValue) => {
                          if (inputValue === "") return true;
                          const searchValue = inputValue.toLowerCase();
                          const itemValue = String(textValue).toLowerCase();
                          return itemValue.includes(searchValue);
                        }}
                        defaultItems={categoryData?.data?.map((item: any) => ({
                          key: String(item.id),
                          value: String(item.id),
                          label: item.name,
                        })) || []}
                      >
                        {(category: any) => (
                          <AutocompleteItem key={category.key} value={category.value}>
                            {category.label}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  </div>
                </Tab>
                <Tab key="add" title="Add New Category">
                  <form onSubmit={handleAddCategory(onAddCategorySubmit)} className="mt-4">
                    <div className="flex flex-col gap-4">
                      <Controller
                        name="name"
                        control={addCategoryControl}
                        rules={{ required: "Please enter category name" }}
                        render={({ field }) => (
                          <InputNextUI
                            type="text"
                            label="Category Name"
                            size="sm"
                            {...field}
                            isRequired={true}
                            isInvalid={addCategoryErrors?.["name"] ? true : false}
                            errorMessage={addCategoryErrors?.["name"]?.message}
                          />
                        )}
                      />
                      <Button
                        color="primary"
                        type="submit"
                        size="md"
                        isLoading={isAddingCategory}
                        isDisabled={isAddingCategory}
                      >
                        {isAddingCategory ? "Adding..." : "Add Category"}
                      </Button>
                    </div>
                  </form>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  if (internalSelectedCategoryId !== null && onCategorySelect) {
                    onCategorySelect(internalSelectedCategoryId);
                  }
                  onClose();
                }}
                isDisabled={internalSelectedCategoryId === null}
              >
                Select
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CategoryModal;

