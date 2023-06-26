import * as yup from 'yup'
import english from './english'

export const noticationSchema = yup.object().shape({
   title: yup.string().required(english.titleErrorMsg),
   content: yup.string().required(english.contentErrorMsg),
   notification_date:yup.date().required(english.dateErrorMsg),
   notification_time:yup.string().required(english.timeErrorMsg)
})