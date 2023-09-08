import * as Yup from "yup";

const podcastSchema = Yup.object().shape({
  title: Yup.string().min(2).max(255).required("is Required"),
  link: Yup.string().min(2).max(1000).required("is Required"),
  coverPhoto: Yup.string().min(2).max(100).required("is Required"),
  description: Yup.string().min(2).max(100).required("is Required"),
  date: Yup.string().min(2).max(1000).required("is Required"),
});

export { podcastSchema };
