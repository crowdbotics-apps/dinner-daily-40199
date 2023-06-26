import * as yup from "yup"
export const recipeIngredientSchema = yup.object().shape({
  is_round_up_for_half_family_size: yup.number().required("It is a required field"),
})
