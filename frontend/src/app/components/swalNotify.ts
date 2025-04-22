import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2';

export async function swalNotify(
  icon2: SweetAlertIcon = 'warning',
  title2: string = 'Are you sure ?',
  text2: string = "",
  position2: SweetAlertPosition = 'center'
) {
  return Swal.fire({
    title: title2,
    position: position2,
    text: text2,
    icon: icon2,
    showConfirmButton:false,
    showCancelButton: false,
    timer:800,
      customClass: {
        title: 'custom-swal-title-notify',
      }
  });
}
