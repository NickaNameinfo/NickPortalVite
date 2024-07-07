import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Divider,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";

export const InfoCard = (props: {
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
}) => {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={"5xl"}
        backdrop="opaque"
        scrollBehavior="inside"
        placement="top"
      >
        <ModalContent className="px-5 pb-3">
          <>
            <ModalHeader className="py-3 px-0 flex items-center justify-start text-black font-semibold text-base">
            Information
            </ModalHeader>
            <ModalBody className="p-0 m-0 mt-3">
              <div className="font-normal text-sm text-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                laoreet ante at tortor eleifend, non mollis eros tincidunt.
                Proin ut eros vel leo dignissim tempor. Etiam lobortis elit
                lorem, id interdum orci hendrerit eu. Donec eu tellus finibus
                est pellentesque hendrerit. Vestibulum at nisl sit amet quam
                malesuada auctor eget id mi. Vestibulum a ornare dui. Duis
                imperdiet id dolor at dignissim. Donec nisl ante, mollis
                vehicula sollicitudin non, laoreet vitae risus. Quisque eu lacus
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                laoreet ante at tortor eleifend, non mollis eros tincidunt.
                Proin ut eros vel leo dignissim tempor. Etiam lobortis elit
                lorem, id interdum orci hendrerit eu. Donec eu tellus finibus
                est pellentesque hendrerit.
                <p className="mt-3">
                  Vestibulum at nisl sit amet quam malesuada auctor eget id mi.
                  Vestibulum a ornare dui. Duis imperdiet id dolor at dignissim.
                  Donec nisl ante, mollis vehicula sollicitudin non, laoreet
                  vitae risus. Quisque eu lacus Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Donec laoreet ante at tortor
                  eleifend, non mollis eros tincidunt. Proin ut eros vel leo
                  dignissim tempor. Etiam lobortis elit lorem, id interdum orci
                  hendrerit eu. Donec eu tellus finibus est pellentesque
                  hendrerit. Vestibulum at nisl sit amet quam malesuada auctor
                  eget id mi. Vestibulum a ornare dui. Duis imperdiet id dolor
                  at dignissim. Donec nisl ante, mollis vehicula sollicitudin
                  non, laoreet vitae risus. Quisque eu lacus Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Donec laoreet ante at
                  tortor eleifend, non mollis eros tincidunt. Proin ut eros vel
                  leo dignissim tempor. Etiam lobortis elit lorem, id interdum
                  orci hendrerit eu. Donec eu tellus finibus est pellentesque
                  hendrerit. Vestibulum at nisl sit amet quam malesuada auctor
                  eget id mi. Vestibulum a ornare dui. Duis imperdiet id dolor
                  at dignissim. Donec nisl ante, mollis vehicula sollicitudin
                  non, laoreet vitae risus. Quisque eu lacus Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Donec laoreet ante at
                  tortor eleifend, non mollis eros tincidunt. Proin ut eros vel
                  leo dignissim tempor.
                </p>
                <p className="mt-3">
                  Etiam lobortis elit lorem, id interdum orci hendrerit eu.
                  Donec eu tellus finibus est pellentesque hendrerit. Vestibulum
                  at nisl sit amet quam malesuada auctor eget id mi. Vestibulum
                  a ornare dui. Duis imperdiet id dolor at dignissim. Donec nisl
                  ante, mollis vehicula sollicitudin non, laoreet vitae risus.
                  Quisque eu lacus Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Donec laoreet ante at tortor eleifend, non
                  mollis eros tincidunt. Proin ut eros vel leo dignissim tempor.
                  Etiam lobortis elit lorem, id interdum orci hendrerit eu.
                  Donec eu tellus finibus est pellentesque hendrerit. Vestibulum
                  at nisl sit amet quam malesuada auctor eget id mi. Vestibulum
                  a ornare dui. Duis imperdiet id dolor at dignissim. Donec nisl
                  ante, mollis vehicula sollicitudin non, laoreet vitae risus.
                  Quisque eu lacus Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Donec laoreet ante at tortor eleifend, non
                  mollis eros tincidunt. Proin ut eros vel leo dignissim tempor.
                  Etiam lobortis elit lorem, id interdum orci hendrerit eu.
                  Donec eu tellus finibus est pellentesque hendrerit. Vestibulum
                  at nisl sit amet quam malesuada auctor eget id mi. Vestibulum
                  a ornare dui.
                </p>
                <p className="mt-3">
                  Duis imperdiet id dolor at dignissim. Donec nisl ante, mollis
                  vehicula sollicitudin non, laoreet vitae risus. Quisque eu
                  lacus Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Donec laoreet ante at tortor eleifend, non mollis eros
                  tincidunt. Proin ut eros vel leo dignissim tempor. Etiam
                  lobortis elit lorem, id interdum orci hendrerit eu. Donec eu
                  tellus finibus est pellentesque hendrerit. Vestibulum at nisl
                  sit amet quam malesuada auctor eget id mi. Vestibulum a ornare
                  dui. Duis imperdiet id dolor at dignissim. Donec nisl ante,
                  mollis vehicula sollicitudin non, laoreet vitae risus. Quisque
                  eu lacus Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Donec laoreet ante at tortor eleifend, non mollis eros
                  tincidunt. Proin ut
                </p>{" "}
                eros vel leo dignissim tempor. Etiam lobortis elit lorem, id
                interdum orci hendrerit eu. Donec eu tellus finibus est
                pellentesque hendrerit. Vestibulum at nisl sit amet quam
                malesuada auctor eget id mi. Vestibulum a ornare dui. Duis
                imperdiet id dolor at dignissim. Donec nisl ante, mollis
                vehicula sollicitudin non, laoreet vitae risus. Quisque eu lacus
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};
