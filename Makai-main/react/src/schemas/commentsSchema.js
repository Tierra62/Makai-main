import * as Yup from "yup";

const commentsSchema = Yup.object().shape({
  subject: Yup.string().max(50),
  text: Yup.string().required("Required"),
  entityId: Yup.number().required(),
  entityTypeId: Yup.number().required(),
});

export { commentsSchema };
