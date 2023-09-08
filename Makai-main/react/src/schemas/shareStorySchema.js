import * as Yup from "yup";

const shareStorySchema = Yup.object().shape({
  id: Yup.number().min(0),
  name: Yup.string().min(2).max(100).required("Name is required"),
  story: Yup.string().min(2).max(4000).required("Enter a text"),
  email: Yup.string().min(0).max(255).required("Enter an email"),
});

export { shareStorySchema };
