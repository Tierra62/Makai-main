import * as Yup from "yup";

function calculateAge(birthday) {
  const ageDifMs = Date.now() - birthday;
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const registrationSchema = Yup.object().shape({
  firstName: Yup.string().min(2).max(255).required("First name required."),
  lastName: Yup.string().min(2).max(100).required("Last name required."),
  mi: Yup.string().max(2, "Max of two characters."),
  dob: Yup.date()
    .required("Date of birth required")
    .test(
      "dateOfBirth",
      "You must be at least 18 years old to register.",
      function (value) {
        return calculateAge(new Date(value)) >= 18;
      }
    ),
  roleId: Yup.number().required("Select a role"),
  email: Yup.string()
    .min(2)
    .max(100)
    .email("Invalid email provided.")
    .required("Email required."),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match.")
    .required("Confirm password required."),
  phone: Yup.string().min(10).max(10).required("Phone number required."),
  avatarUrl: Yup.string().max(255),
});

export { registrationSchema };
