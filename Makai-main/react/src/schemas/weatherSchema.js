import * as Yup from "yup";

const weatherSchema = Yup.object({
  locationSearch: Yup.string().required("Required"),
});

export default weatherSchema;
