import * as Yup from "yup";

const newRecommendationFormSchema = Yup.object().shape({
  partnerId: Yup.number()
    .min(1)

    .required("Please select valid partner"),
  sourceProductId: Yup.number()
    .min(1)

    .required("Please select valid product"),
  targetProductId: Yup.number()
    .min(1)

    .required("Please select valid product"),
  reason: Yup.string().required("Please provide a reason for recommendation"),
});

export default newRecommendationFormSchema;
