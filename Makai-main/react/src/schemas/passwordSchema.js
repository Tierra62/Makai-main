import * as Yup from "yup";

const passwordSchema = Yup.object().shape({
  password: Yup.string().min(8).max(100).required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match.")
    .required("Confirm password required."),
});

export { passwordSchema };
