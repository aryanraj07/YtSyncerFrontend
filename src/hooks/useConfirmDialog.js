// hooks/useConfirmDialog.js
import Swal from "sweetalert2";

import "sweetalert2/dist/sweetalert2.min.css";

export const useConfirmDialog = () => {
  const confirm = async (message, options = {}) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: message,
      icon: options.icon || "question",
      showCancelButton: true,
      confirmButtonText: options.confirmText || "Yes",
      cancelButtonText: options.cancelText || "Cancel",
      ...options,
    });

    return result.isConfirmed;
  };

  return { confirm };
};
