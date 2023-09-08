import * as Yup from "yup";
const siteTrainingFormSchema = Yup.object().shape({
  categoryId: Yup.number()
    .min(1)
    .max(255)
    .required("Category of training is required"),
  title: Yup.string().min(2).max(50).required("Title is required "),
  description: Yup.string().max(500).required("Description is required "),
});
export { siteTrainingFormSchema };
