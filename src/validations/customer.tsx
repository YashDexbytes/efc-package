import * as yup from "yup";

const baseSchema = {
  firstName: yup
    .string()
    .trim()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters"),
  lastName: yup.string().trim().notRequired(),
  gender: yup
    .string()
    .trim()
    .oneOf(["m", "f", "o"], "Please select a valid gender")
    .required("Gender is required"),
  emailId: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .email("Invalid email format")
    .test(
      "no-consecutive-dots",
      "Email cannot contain consecutive dots",
      (value) =>
        value === undefined ||
        value === null ||
        value === "" ||
        !/\.{2,}/.test(value),
    )
    .test(
      "no-special-chars-except-allowed",
      "Email can only contain letters, numbers, and . _ -",
      (value) =>
        value === undefined ||
        value === null ||
        value === "" ||
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value),
    ),
  phoneNumber: yup
    .string()
    .trim()
    .min(12, "Phone number must be 10 digits")
    .matches(/^[0-9]+$/, "Phone number must only contain numbers")
    .required("This field is required"),
  profilePic: yup
    .mixed()
    .nullable()
    .test("fileFormat", "Please upload valid image", (value) => {
      if (!value) return true; // Allow null values
      const acceptedFormats = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/svg+xml",
      ];
      if (typeof value === "string" && value.startsWith("https://")) {
        return true; // Accept valid URL
      }
      return acceptedFormats.includes((value as any).type);
    }),
  dob: yup.object().shape({
    day: yup.string().notRequired(),
    month: yup.string().notRequired(),
  }),
  promotionId: yup.string().trim().notRequired(),
  purchaseDate: yup.date().notRequired(),
};

const passwordSchema = {
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must include at least one special character",
    )
    .min(8, "Password must be at least 8 characters"),
};

export const createCustomerSchema = yup.object().shape({
  ...baseSchema,
  ...passwordSchema,
});

export const updateCustomerSchema = yup.object().shape({
  ...baseSchema,
});
