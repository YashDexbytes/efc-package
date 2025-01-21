import * as Yup from "yup"; // Add this import

const isRequiredNumber = (message: string) =>
  Yup.number()
    .typeError(message) // This will catch non-number types like empty string
    .required(message); // This ensures the field is required
//   .nullable();

const tenantSchema = {
  domainName: Yup.string().trim().required("This field is required"),
};
const baseSchema = {
  firstName: Yup.string()
    .trim()
    .required("This field is required")
    .min(3, "First Name must be at least 3 characters"), // Added minimum length
  lastName: Yup.string()
    .trim()
    .required("This field is required")
    .min(3, "First Name must be at least 3 characters"),
  emailId: Yup.string()
    .trim()
    .nullable() // Updated to allow null
    .notRequired() // Updated to not be required
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
  mobileNumber: Yup.string()
    .trim()
    .min(12, "Phone number must be 10 digits")
    .matches(/^[0-9]+$/, "Phone number must only contain numbers")
    .required("This field is required"),
  dateOfJoining: Yup.date()
    .typeError("This field is required")
    .required("This field is required")
    .nullable(),
  exitDate: Yup.date()
    .nullable()
    .when('dateOfJoining', (dateOfJoining: any, schema: any) => {
      // Convert dateOfJoining to a Date object if it's not already
      const joiningDate = new Date(dateOfJoining);
      
      // Check if joiningDate is valid
      if (isNaN(joiningDate.getTime())) {
        return schema; // If not valid, return the schema without changes
      }

      // Ensure that joiningDate is a valid date before setting hours
      const normalizedJoiningDate = new Date(joiningDate.setHours(0, 0, 0, 0));

      return schema.min(normalizedJoiningDate, "Exit Date should be greater than or equal to Date of Joining");
    }),
  gender: Yup.string()
    .trim()
    .oneOf(["m", "f", "o"], "This field is required")
    .required("This field is required"),
  addressLine1: Yup.string().trim().required("This field is required"),
  addressLine2: Yup.string().trim().nullable(),
  city: isRequiredNumber("This field is required"),
  state: isRequiredNumber("This field is required"),
  country: isRequiredNumber("This field is required"),
  pincode: Yup.string()
    .trim()
    .required("This field is required")
    .max(9, "Zipcode cannot be more than 9 characters"),
  profilePic: Yup.mixed().nullable(),
  experienceYears: isRequiredNumber("This field is required"),
  experienceMonths: isRequiredNumber("This field is required"),
  commissionPercentage: Yup.number()
    .transform((value) => {
      // Convert empty string or undefined to null
      if (value === "" || value === undefined) return null;
      // If the value is a valid number, return it; otherwise, return NaN
      return isNaN(value) ? null : value;
    })
    .nullable()
    .notRequired()
    .min(0, "Commission must be at least 0")
    .max(100, "Commission cannot exceed 100"),
  staffBio: Yup.string().nullable(),
  tenantAddressId: isRequiredNumber("This field is required"),
  // roles: Yup.array().of(Yup.number()).required('Role is required'),
  roles: Yup.number()
    .typeError("This field is required")
    .required("This field is required"),
};

export const commonValidationSchema = Yup.object().shape({
  ...baseSchema,
});

export const adminValidationSchema = Yup.object().shape({
  ...baseSchema,
  ...tenantSchema,
});
