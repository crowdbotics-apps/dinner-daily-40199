import * as yup from 'yup'
import english from './english'

export const UserSchema = yup.object().shape({
  emailId: yup.string()
  .required(english.emailerrorMsg)
  .email("Please enter a valid email"),
   name: yup.string()
  .required(english.nameErrorMsg),
  role: yup.string().required(english.role),
  phonenum:yup.string()
  .required(english.contactErrorMsg)
})