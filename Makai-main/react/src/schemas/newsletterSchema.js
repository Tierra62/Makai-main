import * as Yup from "yup";
import debug from "sabio-debug";

const _logger = debug.extend("NewsletterSchema");

const generateValidationSchema = (contentList) => {
  _logger("is this value being reached?", contentList);
  let date = new Date();
  date.setHours(0, 0, 0, 0);
  let schema = {
    templateId: Yup.number().required("Is Required"),
    name: Yup.string().min(2).max(100).required("Is Required"),
    coverPhoto: Yup.string().min(2).max(255).nullable(),
    dateToPublish: Yup.date()
      .min(new Date().toISOString(), "Date to Publish must not be in the past")
      .nullable(),
    dateToExpire: Yup.date()
      .min(new Date().toISOString(), "Date to Expire must not be in the past")
      .nullable(),

    contentList: Yup.array().of(
      Yup.lazy((value) => {
        let fieldSchema = {};
        _logger("here's value.id", value.id, value);
        let switchValue = 0;
        if (value?.keyType) {
          switchValue = value.keyType.id;
        } else {
          switchValue = value.dataTypeId;
        }
        switch (switchValue) {
          case 1:
            fieldSchema = Yup.object({
              value: Yup.string()
                .min(2, `${value.name} must be at least 2 characters long`)
                .required("This field is required"),
            });
            break;

          case 2:
            fieldSchema = Yup.object({
              value: Yup.number().required("This field is required"),
            });
            break;

          case 3:
            fieldSchema = Yup.object({
              value: Yup.string()
                .min(2, `${value.name} must be at least 2 characters long`)
                .required("This field is required"),
            });
            break;

          case 4:
            fieldSchema = Yup.object({
              value: Yup.bool().required("This field is required"),
            });
            break;

          case 5:
            fieldSchema = Yup.object({
              value: Yup.string()
                .min(2, `${value.name} must be at least 2 characters long`)
                .required("This field is required"),
            });
            break;

          case 6:
            fieldSchema = Yup.object({
              value: Yup.string()
                .min(2, `${value.name} must be at least 2 characters long`)
                .required("This field is required"),
            });
            break;

          case 7:
            fieldSchema = Yup.object({
              value: Yup.string()
                .min(2, `${value.name} must be at least 2 characters long`)
                .required("This field is required"),
            });
            break;

          case 8:
            fieldSchema = Yup.object({
              value: Yup.date().required("This field is required"),
            });
            break;

          default:
            fieldSchema = null;
            break;
        }
        return fieldSchema;
      })
    ),
  };
  return Yup.object().shape(schema);
};

export { generateValidationSchema };
