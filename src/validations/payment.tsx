import * as yup from "yup";

export const editInvoicePaymentSchema = yup.object().shape({
  payment: yup.object().shape({
    transactionId: yup.string().required("Transaction ID is required"),
    transactionDate: yup.date().required("Transaction date is required"),
    ewalletAmount: yup.number().nullable(),
    cashAmount: yup.number().nullable(),
    upiAmount: yup.number().nullable(),
  }),
});
