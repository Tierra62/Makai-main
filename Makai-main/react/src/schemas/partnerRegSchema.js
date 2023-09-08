import * as Yup from "yup";

const phoneFormat = "^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$";

const partnerRegSchema = Yup.object().shape({
  name: Yup.string().min(2).max(100).required("Name Required"),
  logo: Yup.string().min(2).max(255).required("Logo Required"),
  businessPhone: Yup.string()
    .matches(phoneFormat, "Format: 555-123-4567")
    .min(12)
    .max(12)
    .required("Phone Number Required"),
  siteUrl: Yup.string().min(2).max(255).required("Website Url Required"),
});

export { partnerRegSchema, phoneFormat };
