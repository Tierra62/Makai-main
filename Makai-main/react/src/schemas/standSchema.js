import * as Yup from "yup";

const standSchema = Yup.object().shape({
  address: Yup.string()
    .min(2, "Please Enter a Valid Address, City, or Zip")
    .required("Please Enter a Valid Address, City, or Zip"),
  distance: Yup.string()
    .max(2, "Please Select a Distance")
    .required("Please Select a Distance"),
});

export { standSchema };
