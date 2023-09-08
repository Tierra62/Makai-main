import * as Yup from "yup";

const faqFormSchema = Yup.object().shape({
  question: Yup.string().required("Question Required"),
  answer: Yup.string().required("Answer Required"),
  faqCategory: Yup.number().required("Please select a category"),
});

export { faqFormSchema };
