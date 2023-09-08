import * as Yup from "yup";
const externalLinkSchema = Yup.object().shape({
  urlTypeId: Yup.number().min(1).max(5).required("Please select a Url Type."),
  url: Yup.string()
    .min(2, "Your Url must be at least 2 characters.")
    .max(255, "Your Url cannot be longer than 255 characters.")
    .required("Please enter a Url "),
  entityId: Yup.number()
    .min(1, "Please enter an Entity Id")
    .max(2147483647, "Cannot be greater than 2147483647")
    .required("Entity Id is required. If unsure or N/A, enter 123."),
  entityTypeId: Yup.number()
    .min(1, "Please select an Entity Type Id.")
    .max(5, "Please select an Entity Type Id.")
    .required("Please select an Entity Type."),
});
export default externalLinkSchema;
