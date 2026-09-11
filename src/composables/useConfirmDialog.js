/**
 * useConfirmDialog
 * ================
 * Composable untuk mengontrol status ConfirmDialog reusable.
 *
 * Cara pakai:
 *   const { confirmDialog, openConfirm, closeConfirm } = useConfirmDialog();
 *
 *   // Buka dialog saat tombol form diklik (setelah validasi):
 *   openConfirm('save')    // atau 'update' / 'delete'
 *
 *   // Di template:
 *   <ConfirmDialog
 *     :show="confirmDialog.show"
 *     :type="confirmDialog.type"
 *     :loading="loading"
 *     @confirm="executeSubmit"
 *     @cancel="closeConfirm"
 *   />
 */

import { reactive } from 'vue';

export function useConfirmDialog() {
  const confirmDialog = reactive({
    show: false,
    type: 'save',
  });

  const openConfirm = (type = 'save') => {
    confirmDialog.type = type;
    confirmDialog.show = true;
  };

  const closeConfirm = () => {
    confirmDialog.show = false;
  };

  return { confirmDialog, openConfirm, closeConfirm };
}
