import * as Yup from "yup";

const emailSchemaV2 = Yup.object().shape({
  newEmail: Yup.string().email("Invalid Email").required("Email required"),
  currentPassword: Yup.string()
    .max(100, "Current Password must be at most 100 characters")
    .required("Current Password required"),
});

export { emailSchemaV2 };
