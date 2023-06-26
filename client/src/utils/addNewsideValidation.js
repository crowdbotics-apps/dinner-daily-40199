import * as yup from "yup"

export const sideSchema = yup.object().shape({
  firstSide: yup.string().required("It is a required field")
})
