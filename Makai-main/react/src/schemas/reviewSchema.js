import * as Yup from "yup";

const reviewSchema = Yup.object().shape({
  subject: Yup.string().min(2).max(50),
  text: Yup.string().min(20).max(3000),
});

export { reviewSchema };
