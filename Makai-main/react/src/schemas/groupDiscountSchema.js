import * as Yup from "yup";

const groupDiscountSchema = Yup.object().shape({
  name: Yup.string().min(2).max(50).required("a Name is required"),
  description: Yup.string()
    .min(2)
    .max(400)
    .required(" a Description is required"),
  discountTypeId: Yup.number().required("Select a Discount Type"),
  value: Yup.number().required(" a Value is required"),
  startDate: Yup.date().min(new Date()).required("Please select a Start Date"),
  endDate: Yup.date().required("Please select an End Date"),
});

export { groupDiscountSchema };
