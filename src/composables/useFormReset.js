/**
 * useFormReset
 * ============
 * Composable reusable untuk mereset form.
 *
 * Cara pakai — cukup 1 baris di komponen manapun:
 *
 *   const { resetForm } = useFormReset(
 *     form,
 *     { username: '', email: '', roleid: '' },
 *     {
 *       errors:      { ref: errors,      defaultValue: {} },
 *       globalError: { ref: globalError, defaultValue: '' },
 *       successMsg:  { ref: successMsg,  defaultValue: '' },
 *     }
 *   );
 *
 * Setelah itu langsung pakai resetForm() — tidak perlu buat method lokal lagi.
 *
 * @param {Reactive} form          - reactive object form
 * @param {Object}   initialValues - nilai default per field form
 * @param {Object}   extraRefs     - ref-ref tambahan yang ikut di-reset
 *                                   format: { namaRef: { ref, defaultValue } }
 */
export function useFormReset(form, initialValues = {}, extraRefs = {}) {

  const resetForm = () => {

    // Reset semua field form ke nilai awalnya
    Object.keys(initialValues).forEach((key) => {
      form[key] = initialValues[key];
    });

    // Reset semua extra ref (errors, globalError, successMsg, dll)
    Object.values(extraRefs).forEach(({ ref, defaultValue }) => {
      ref.value = defaultValue;
    });
  };

  return { resetForm };
}
