import * as Yup from "yup";

export const phoneRegExp =
  "^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$";

export const emergencyContactSchema = Yup.object().shape({
  name: Yup.string().min(2).max(100).required("Full name required"),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, "Format: (xxx)-xxx-xxxx")
    .min(12)
    .max(12)
    .required("Phone Number Required"),
});

export default { phoneRegExp, emergencyContactSchema };
