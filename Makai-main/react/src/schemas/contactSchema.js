import * as Yup from "yup";

const contactSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Email is Required"),
  firstName: Yup.string().min(2).max(30).required("is Required"),
  lastName: Yup.string().min(2).max(30).required("is Required"),

  message: Yup.string().min(2).max(200).required("is Required"),
});

export { contactSchema };
