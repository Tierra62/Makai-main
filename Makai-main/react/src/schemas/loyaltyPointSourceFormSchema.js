import * as Yup from "yup";

const loyaltyPointSourceFormSchema = Yup.object().shape({
  id: Yup.number(),
  name: Yup.string().min(1).max(100).required("Is Required"),
  pointsAwarded: Yup.number().required("Is Required"),
  dateExpire: Yup.string().nullable(),
});

export default loyaltyPointSourceFormSchema;
