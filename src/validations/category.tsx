/* eslint-disable prettier/prettier */
import * as yup from "yup";

const baseSchema = {
  categoryName: yup
    .string()
    .trim()
    .required("Category Name is required")
    .min(3, "Category Name must be at least 3 characters"),
  categoryDescription: yup
    .string()
    .trim(),
  parentId: yup
    .string()
    .nullable()
    .notRequired()
    .test("is-valid-uuid", "Invalid Parent Category ID", (value) => {
      if (!value) return true; // Allow null values
      // eslint-disable-next-line prettier/prettier
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(value);
    }),
  categoryImage: yup
    .mixed()
    .nullable()
    .test("fileFormat", "Please upload a valid image", (value) => {
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
};

export const createCategorySchema = yup.object().shape({
  ...baseSchema,
});

export const updateCategorySchema = yup.object().shape({
  ...baseSchema,
});