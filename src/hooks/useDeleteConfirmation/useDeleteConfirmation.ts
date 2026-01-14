import { useState } from "react";

export function useDeleteConfirmation() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return {
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
  };
}
