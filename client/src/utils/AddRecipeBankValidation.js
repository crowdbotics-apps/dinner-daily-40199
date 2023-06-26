import * as yup from "yup"
import english from "./english"

export const loginSchema = yup.object().shape({
  bankname: yup.string().required(english?.banknameErrorMsg),
  sortorder: yup.number().required(english?.sortorderErrorMsg),
  recipe: yup.string().required(english?.recipeErrorMsg)
})
