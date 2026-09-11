/**
 * useToast
 * ========
 * Composable untuk menampilkan toast notification.
 *
 * Cara pakai (di komponen manapun):
 *
 *   import { useToast } from '@/composables/useToast.js';
 *   import ToastNotif from '@/components/ui/ToastNotif.vue';
 *
 *   const { toast, showToast, hideToast } = useToast();
 *
 *   // Panggil saat operasi berhasil:
 *   showToast('save')    // "Data berhasil disimpan"
 *   showToast('update')  // "Perubahan data berhasil disimpan"
 *   showToast('delete')  // "Data berhasil dihapus"
 *
 *   // Di template:
 *   <ToastNotif :show="toast.show" :type="toast.type" @close="hideToast" />
 */

import { reactive } from 'vue';

export function useToast(duration = 3500) {
  const toast = reactive({ show: false, type: '' });
  let timer = null;

  const showToast = (type) => {
    if (timer) clearTimeout(timer);
    toast.type = type;
    toast.show = true;
    timer = setTimeout(() => { toast.show = false; }, duration);
  };

  const hideToast = () => {
    if (timer) clearTimeout(timer);
    toast.show = false;
  };

  return { toast, showToast, hideToast };
}
