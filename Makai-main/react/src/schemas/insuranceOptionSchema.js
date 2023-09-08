import * as Yup from "yup";

const insuranceOptionSchema = Yup.object().shape({
  cost: Yup.number().min(0).max(200).required("Required"),
  termsOfAgreement: Yup.bool()
    .required() // a message inside required never shows if we also have the oneOf() function
    .oneOf([true], "Field must be checked"),
});

export { insuranceOptionSchema };
