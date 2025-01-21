import * as yup from "yup";
const isRequiredNumber = (message: string) =>
  yup
    .number()
    .typeError(message) // This will catch non-number types like empty string
    .required(message) // This ensures the field is required
    .min(1, "Service duration is required.");
//   .nullable();
export const serviceSchema = yup.object().shape({
  serviceName: yup
    .string()
    .trim()
    .required("This field is required")
    .min(3, "Service name must be at least 3 characters long")
    .max(100, "Service name cannot be longer than 100 characters"),

  category: yup
    .array()
    .of(yup.string().required("Each category must have a valid value"))
    .min(1, "This field is required")
    .required("This field is required"),

  price: yup
    .number()
    .required("This field is required")
    .positive("Price must be greater than 0")
    .typeError("This field is required")
    .min(0.01, "Please enter a valid service price"),

  duration: isRequiredNumber("This field is required"),

  description: yup
    .string()
    .trim()
    .max(150, "Service description cannot exceed 150 characters"),

  profilePic: yup.array().of(yup.mixed()).nullable(),
});
