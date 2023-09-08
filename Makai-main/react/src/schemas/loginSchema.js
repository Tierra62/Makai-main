import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string().max(255).required("Email required"),
  password: Yup.string().max(255).required("Password required"),
});

export { loginSchema };
