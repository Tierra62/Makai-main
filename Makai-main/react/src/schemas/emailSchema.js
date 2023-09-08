import * as Yup from "yup";

const emailSchema = Yup.object().shape({
  email: Yup.string()
    .min(2)
    .max(255)
    .email("Invalid email provided.")
    .required("Email required."),
});

export { emailSchema };
