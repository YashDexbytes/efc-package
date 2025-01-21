import * as Yup from "yup";

interface DiscountFormValues {
    discountCode: string;
    discountTitle: string;
    flatDiscount: number;
    maxInvoiceValue: number;
    discountRate: number;
    occasion?: string | null;
}

const baseSchema = Yup.object().shape({
    discountCode: Yup.string().trim().required("This field is required"),
    discountTitle: Yup.string().trim().required("This field is required"),
    discountRate: Yup.number()
    .typeError("This field is required")
    .required("This field is required")
    .min(0.01, "Discount rate must be greater than 0")
    .max(100, "Discount cannot exceed 100")
    .test('is-decimal', 'Must be a number with up to 2 decimal places', value => {
      return value === undefined || /^\d+(\.\d{1,2})?$/.test(String(value));
    }),
    maxInvoiceValue: Yup.number()
      .typeError("This field is required")
      .required("This field is required")
      .min(0.01, "Max order value must be greater than 0")
      .test('is-decimal', 'Must be a number with up to 2 decimal places', value => {
        return value === undefined || /^\d+(\.\d{1,2})?$/.test(String(value));
      }),
      flatDiscount: Yup.number()
      .typeError("This field is required")
      .required("This field is required")
      .min(0.01, "Discount price must be greater than 0")
      .test('is-decimal', 'Must be a number with up to 2 decimal places', value => {
        return value === undefined || /^\d+(\.\d{1,2})?$/.test(String(value));
      }),
    occasion: Yup.string().trim().required("This field is required"),
}) as Yup.ObjectSchema<DiscountFormValues>;

export const createDiscountSchema = baseSchema;

