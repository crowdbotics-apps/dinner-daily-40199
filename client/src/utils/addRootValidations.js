import * as yup from 'yup'
import english from './english'

export const rootCategory = yup.object().shape({
  name: yup.string()
  .required(english.nameErrorMsg),
})