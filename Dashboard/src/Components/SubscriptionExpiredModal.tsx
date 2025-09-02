import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

interface SubscriptionExpiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export const SubscriptionExpiredModal: React.FC<SubscriptionExpiredModalProps> = ({
    isOpen,
    onClose,
    title = "Subscription Limit Reached",
    message = "You have reached the maximum number of products allowed under your current subscription plan. Please upgrade your plan to add more products.",
}) => {
    const navigate  = useNavigate()
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-red-500">
                            <div className="flex items-center gap-2">
                                {/* <RiErrorWarningLine fill="red" width={24} height={24} />  */}
                                {title}
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <p>{message}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={() => {
                                onClose()
                                navigate("/Subscriptions")
                            }}>
                                Buy More
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};