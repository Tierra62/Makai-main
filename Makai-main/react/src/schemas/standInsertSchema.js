import * as Yup from "yup";

const standInsertSchema = Yup.object().shape({
  standStatusId: Yup.number().required("Please Select a Stand Status"),
  standTypeId: Yup.number().required("Please Select a Stand Type"),
  dateOpened: Yup.date().required("Select a Date"),
});

export { standInsertSchema };
