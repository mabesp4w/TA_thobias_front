/** @format */

import * as yup from "yup";

// Schema validasi untuk form user
export const validationSchema = yup.object({
  username: yup.string().required("Username wajib diisi"),
  first_name: yup.string().required("Nama wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Password wajib diisi"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});
