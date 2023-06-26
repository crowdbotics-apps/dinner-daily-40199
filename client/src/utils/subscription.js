import * as yup from "yup"

export const subscriptionSchema = yup.object().shape({
  name: yup.string().required("Package Name is a required field"),
  recurring: yup.string().required("Billing Cycle is a required field"),
  amount: yup.number().required("Cost is a required field")
})
