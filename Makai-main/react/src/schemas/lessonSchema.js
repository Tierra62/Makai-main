import * as Yup from "yup";

const LessonSchema = Yup.object().shape({
  siteTrainingId: Yup.number().required("Is Required"),
  title: Yup.string().min(2).max(50).required("Is Required"),
  subject: Yup.string().min(2).max(50).required("Is Required"),
  summary: Yup.string().min(2).max(200).required("Is Required"),
  duration: Yup.string().min(2).max(50).required("Is Required"),
  coverImageUrl: Yup.string().min(2).max(250).required("Is Required"),
  lessonTypeId: Yup.number().required("Is Required"),
  mediaUrl: Yup.string().min(2).max(250).required("Is Required"),
});

export { LessonSchema };
