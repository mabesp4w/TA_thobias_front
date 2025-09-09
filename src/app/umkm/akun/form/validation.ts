/** @format */

import * as yup from "yup";

export const validationSchema = yup.object({
  id: yup.string(),
  username: yup
    .string()
    .required("Username wajib diisi")
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh berisi huruf, angka, dan underscore"
    ),
  email: yup
    .string()
    .required("Email wajib diisi")
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  password: yup
    .string()
    .transform((value, originalValue) => {
      // Transform empty string to undefined
      return originalValue === "" ? undefined : value;
    })
    .nullable()
    .notRequired()
    .min(8, "Password minimal 8 karakter"),
  password_confirmation: yup
    .string()
    .transform((value, originalValue) => {
      // Transform empty string to undefined
      return originalValue === "" ? undefined : value;
    })
    .nullable()
    .notRequired()
    .oneOf([yup.ref("password"), undefined], "Password tidak cocok"),
});
