import * as Yup from "yup";

export const stripeTransferSchema = Yup.object().shape({
  partnerId: Yup.string().min(10).required("Partner Id Required"),
  amount: Yup.number().min(0).max(10000000).required("Amount Is Required"),
});

export const stripeCartSchema = Yup.object().shape({
  dateCheckIn: Yup.string().required("Check-in date selection required"),
  rentalTime: Yup.number().required("Rental time selection required"),
  quantity: Yup.number().required("Quantity selection required"),
});

export default { stripeTransferSchema, stripeCartSchema };
