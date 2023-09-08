import * as Yup from "yup";

const twoFactorSchema = Yup.object().shape({
  code: Yup.string().min(6).max(6),
});

export { twoFactorSchema };
