import * as Yup from "yup";

const qrCodesSchema = Yup.object().shape({
  standId: Yup.number().required("Please select a stand."),
});

export { qrCodesSchema };
