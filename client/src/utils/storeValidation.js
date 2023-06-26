import * as yup from "yup"
import english from "./english"

export const storeSchema = yup.object().shape({
  name: yup.string().required(english.nameErrorMsg)
})
