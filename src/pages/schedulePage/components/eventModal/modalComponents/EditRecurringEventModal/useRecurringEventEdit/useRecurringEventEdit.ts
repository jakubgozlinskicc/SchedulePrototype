import { useState } from "react";

export function useRecurringEventEdit(onClose: () => void) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(true);
  const [isEditAll, setIsEditAll] = useState<boolean | null>(null);

  const confirmSingle = () => {
    setIsEditAll(false);
    setIsEditModalOpen(false);
  };

  const confirmAll = () => {
    setIsEditAll(true);
    setIsEditModalOpen(false);
  };

  const handleClose = () => {
    setIsEditAll(null);
    setIsEditModalOpen(false);
    onClose();
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  return {
    isEditModalOpen,
    isDeleteModalOpen,
    isEditAll,
    confirmSingle,
    confirmAll,
    handleClose,
    openDeleteModal,
    closeDeleteModal,
  };
}
