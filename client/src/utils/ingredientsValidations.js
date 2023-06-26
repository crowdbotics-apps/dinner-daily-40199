import * as yup from "yup"
import english from "./english"

export const ingredientSchema = yup.object().shape({
  name: yup.string().required(english.nameErrorMsg),
  status: yup.number().required(english.statusErrorMsg),
  tier: yup.number().required(english.tierErrorMsg)
})
