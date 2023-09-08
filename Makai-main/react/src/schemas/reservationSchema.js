import * as Yup from "yup";

const reservationProductSchema = Yup.object().shape({
  productId: Yup.number().required("Product selection required"),
});

const reservationDateSchema = Yup.object().shape({
  dateCheckIn: Yup.string().required("Check-in date selection required"),
  rentalTime: Yup.number().required("Rental time selection required"),
});

const reservationStandSchema = Yup.object().shape({
  standId: Yup.string().required("Stand selection required"),
});

export {
  reservationProductSchema,
  reservationDateSchema,
  reservationStandSchema,
};
