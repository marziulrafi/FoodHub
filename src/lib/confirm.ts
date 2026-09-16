export async function confirmAction(
  title: string,
  text: string,
  confirmButtonText = "Confirm",
) {
  const { default: Swal } = await import("sweetalert2");
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    confirmButtonColor: "#b94724",
    cancelButtonColor: "#53605a",
    focusCancel: true,
    reverseButtons: true,
  });
  return result.isConfirmed;
}
