import * as yup from 'yup'
import english from './english'

export const loginSchema = yup.object().shape({
  username: yup.string()
  .required(english.emailerrorMsg)
  .email("Please enter a valid email"),
  password: yup.string().required(english.passworderrorMsg)
})