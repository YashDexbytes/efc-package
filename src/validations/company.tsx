import * as yup from "yup";

const isRequiredNumber = (message: string) =>
  yup
    .number()
    .typeError(message) // This will catch non-number types like empty string
    .required(message) // This ensures the field is required
    .nullable();

// Common validation schema for both create and edit
const commonSchema = {
  companyName: yup.string().trim().required("This field is required"),
  registrationNumber: yup.string().trim().required("This field is required"),
  emailId: yup
    .string()
    .trim()
    .required("This field is required")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Invalid email format",
    )
    .test(
      "no-consecutive-dots",
      "Email cannot contain consecutive dots",
      (value) => !/\.{2,}/.test(value || ""),
    )
    .test(
      "no-special-chars-except-allowed",
      "Email can only contain letters, numbers, and . _ -",
      (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value || ""),
    ),
  phoneNumber: yup
    .string()
    .trim()
    .min(12, "Phone number must be 10 digits")
    .matches(/^[0-9]+$/, "Phone number must only contain numbers")
    .required("This field is required"),
  username: yup.string().trim().required("This field is required"),
  domainName: yup.string().trim().required("This field is required"),
  addressLine1: yup.string().trim().required("This field is required"),
  addressLine2: yup.string(),
  city: isRequiredNumber("This field is required"),
  state: isRequiredNumber("This field is required"),
  country: isRequiredNumber("This field is required"),
  zipcode: yup
    .string()
    .trim()
    .required("This field is required")
    .max(9, "Zipcode cannot be more than 9 characters"),
  contactFirstName: yup.string().trim().required("This field is required"),
  contactLastName: yup.string().trim().notRequired(),
  contactEmailId: yup
    .string()
    .trim()
    .required("This field is required")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Invalid email format",
    )
    .test(
      "no-consecutive-dots",
      "Email cannot contain consecutive dots",
      (value) => !/\.{2,}/.test(value || ""),
    )
    .test(
      "no-special-chars-except-allowed",
      "Email can only contain letters, numbers, and . _ -",
      (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value || ""),
    ),
  contactPhoneNumber: yup
    .string()
    .trim()
    .min(12, "Phone number must be 10 digits")
    .matches(/^[0-9]+$/, "Phone number must only contain numbers")
    .required("This field is required"),
  contactAlternatePhoneNumber: yup
    .string()
    .matches(/^\d*$/, "Alternate phone number must contain only digits"),
};

// Create validation schema
export const createValidationSchema = yup.object().shape({
  ...commonSchema,
  password: yup
    .string()
    .trim()
    .required("This field is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must include at least one special character",
    ),
});

// Edit validation schema
export const editValidationSchema = yup.object().shape({
  ...commonSchema,
  password: yup.string().trim(), // Password is not required for edit
});
