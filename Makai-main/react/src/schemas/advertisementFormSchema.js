import * as Yup from "yup";
const advertisementSchema = Yup.object().shape({
  productId: Yup.number()
    .min(1)
    .max(255)
    .required("Name of your product is required"),
  title: Yup.string().min(2).max(100).required("Title is required "),
  adMainImage: Yup.string().max(255),
  details: Yup.string().max(100),
  dateStart: Yup.date().required("Start Date is required"),
  dateEnd: Yup.date().required("End Date is required"),
});
export { advertisementSchema };
