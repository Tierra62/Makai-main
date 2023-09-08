import * as Yup from "yup";

const appointmentsFormSchema = Yup.object().shape({
  phone: Yup.string().max(10),
  startDateTime: Yup.string(),
  time: Yup.string()
    .min(8, "Please select from available times")
    .max(8, "Please select from available times")
    .required("Is Required"),
});

export default appointmentsFormSchema;
