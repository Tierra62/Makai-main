import * as Yup from "yup";

const locationSchema = Yup.object().shape({
  locationTypeId: Yup.number().required("Is Required"),
  lineOne: Yup.string().min(2).max(255).required("Is Required"),
  lineTwo: Yup.string().min(2).max(255).required("Is Required"),
  city: Yup.string().min(2).max(255).required("Is Required"),
  zip: Yup.string().min(5).max(50).required("Is Required"),
  stateId: Yup.number().required("Is Required"),
  latitude: Yup.number().required("Is Required"),
  longitude: Yup.number().required("Is Required"),
});

export { locationSchema };
