// src/components/common/DeleteConfirm.js
import Swal from "sweetalert2";

export const DeleteConfirm = async (title = "Bu elementi silmək istədiyinizə əminsinizmi?") => {
    const result = await Swal.fire({
        title: "Silinsin?",
        text: title,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Bəli, sil!",
        cancelButtonText: "Xeyr",
    });
    return result.isConfirmed;
};
