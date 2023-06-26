import * as yup from 'yup'
import english from './english'

export const recipeSchema = yup.object().shape({
  name: yup.string().required(english.nameErrorMsg),
  instructions: yup.string().required(english.instructionsErrorMsg),
})