import * as Yup from "yup";

const blogSchema = Yup.object().shape({
  title: Yup.string().min(2).max(100).required("Title is required"),
  subject: Yup.string().min(2).max(50).required("Subject is required"),
  blogCategoryId: Yup.number().required("Select a Category"),
  content: Yup.string().min(0).max(4000),
});

export { blogSchema };
