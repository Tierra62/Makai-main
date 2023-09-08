import * as Yup from "yup";

const passwordSchemaV2 = Yup.object().shape({
  currentPassword: Yup.string()
    .max(100, "Current Password must be at most 100 characters")
    .required("Current Password required"),
  password: Yup.string()
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      "New Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
    )
    .required("New Password required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm New Password required"),
});

export { passwordSchemaV2 };
