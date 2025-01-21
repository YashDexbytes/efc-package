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
    .notRequired(),
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
  service: yup.array().of(yup.string()).notRequired(),
  provider: yup.string().notRequired(),
  date: yup.string().required("Date is required"),
  hours: yup.string().required("Time is required").test(
    "valid-time",
    "Time should be between 9AM-9PM",
    function (value) {
      const { minutes, meridian } = this.parent; // Access minutes and meridian from the parent context
      const hoursValue = parseInt(value, 10);
      const minutesValue = parseInt(minutes, 10);

      // Convert to 24-hour format for comparison
      const totalMinutes = (meridian === "PM" && hoursValue < 12 ? hoursValue + 12 : hoursValue) * 60 + minutesValue;

      // Check if the time is within the allowed range, excluding 12 AM
      return totalMinutes >= 9 * 60 && totalMinutes <= 21 * 60 && !(hoursValue === 12 && meridian === "AM"); // 9:00 AM to 9:00 PM, excluding 12:00 AM
    }
  ),
  minutes: yup.string().required("Time is required"),
  meridian: yup.string().required("Meridian is required"),
};

export const createBookingSchema = yup.object().shape({
  ...baseSchema,
});
