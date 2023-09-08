import * as Yup from "yup";

const siteReferenceSchema = Yup.object().shape({
  siteReferenceId: Yup.string().required("Is Required"),
});

export default siteReferenceSchema;
