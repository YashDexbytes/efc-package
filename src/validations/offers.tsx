import * as yup from "yup";

export const offerSchema = yup.object().shape({
    promotionName: yup.string().trim().required("This field is required")
    .min(3, "Promotion Name must be at least 3 characters"),
    payPrice: yup.number()
        .typeError("This field is required")
        .required("This field is required")
        .test('min-conditional', 'Pay Price must be greater than 0', function(value) {
            return value > 0;
        })
        .test('max-decimal', 'The decimal places should be up to two digits', value => {
            return value === undefined || value === null || (value.toString().split('.')[1] ? value.toString().split('.')[1].length <= 2 : true);
        }),
    getPrice: yup.number()
        .typeError("This field is required")
        .required("This field is required")
        .test('min-conditional', 'Get Price must be greater than or equal to Pay Price', function(value) {
            const { payPrice } = this.parent; // Access sibling field
            const effectivePayPrice = payPrice || 0; // Treat undefined or null as 0
            return value >= effectivePayPrice;
        })
        .test('max-decimal', 'The decimal places should be up to two digits', value => {
            return value === undefined || value === null || (value.toString().split('.')[1] ? value.toString().split('.')[1].length <= 2 : true);
        }),
    offerDuration: yup.string().required("This field is required"),
}); 