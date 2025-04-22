import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2';

export async function swalMessage(){
    return Swal.fire({
      title: 'Send Message',
      input: 'textarea',
      reverseButtons: true,
      inputPlaceholder: 'Type your message here...',
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel',
      preConfirm: (message) => {
        if (!message) {
          Swal.showValidationMessage('Please enter a message');
        }   
        return { message: message };
      },
      customClass: {
        title: 'custom-swal-title-alert',
      },
    });
}