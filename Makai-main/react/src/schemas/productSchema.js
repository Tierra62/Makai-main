import * as Yup from "yup";

const productSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50),
    productTypeId: Yup.number().required("Please select a type."),
    description: Yup.string().min(2).max(400),
    standId: Yup.number().required(),
    identifier: Yup.number("Please insert the product's serial number/unique identifier."),
    statusType: Yup.number().required("Please select a status type."),
    hourlyPriceInCents: Yup.number().required("Please insert a price."),
    position: Yup.string().min(2).max(50).required("Please insert where the product is located on the stand."),
});

export { productSchema };