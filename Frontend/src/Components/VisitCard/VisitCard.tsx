import React from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import { IconVisitCard } from "../Icons";

export default function VisitCard() {
  const [selectedOption, setSelectedOption] = React.useState(
    new Set(["merge"])
  );

  const descriptionsMap = {
    merge:
      "All commits from the source branch are added to the destination branch via a merge commit.",
    squash:
      "All commits from the source branch are added to the destination branch as a single commit.",
    rebase:
      "All commits from the source branch are added to the destination branch individually.",
  };

  const labelsMap: any = {
    merge: "Create a merge commit",
    squash: "Squash and merge",
    rebase: "Rebase and merge",
  };

  // Convert the Set to an Array and get the first value.
  const selectedOptionValue: any = Array.from(selectedOption)[0];

  return (
    <ButtonGroup variant="flat">
      <Button>{labelsMap[selectedOptionValue]}</Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly>
            <IconVisitCard fill="#e7ffe980" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Merge options"
          selectedKeys={selectedOption}
          selectionMode="single"
          onSelectionChange={() => {
            setSelectedOption;
          }}
          className="max-w-[300px]"
        >
          <DropdownItem key="merge" description={descriptionsMap["merge"]}>
            {labelsMap["merge"]}
          </DropdownItem>
          <DropdownItem key="squash" description={descriptionsMap["squash"]}>
            {labelsMap["squash"]}
          </DropdownItem>
          <DropdownItem key="rebase" description={descriptionsMap["rebase"]}>
            {labelsMap["rebase"]}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
}
