import React, { useState } from "react"
import { Button, Modal} from "react-bootstrap"
import {  Form } from "react-bootstrap"
import { useFormik } from "formik"
import { addSubscription } from "../../api/request"
import ErrorMessage from "../../customComponents/ErrorMessage"
import ErrorMsg from "../../customComponents/ErrorMsg"
import SuccessMsg from "../../customComponents/SuccessMessage"
import TextInput from "../../customComponents/TextInput"
import { subscriptionSchema } from "../../utils/subscription"
import "./style.scss"
import { subInitialValue } from "../../utils/initialValues"
import { BillingArray } from "../../utils/constants"

const AddSubscription = props => {
  const [getpassSuccess, setpassSuccess] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [successMsg,setSuccessMsg] = useState(false);
  const [getError,setError] = useState(false);

  const {
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    isSubmitting
  } = useFormik({
    initialValues:subInitialValue,
    validationSchema: subscriptionSchema,
    onSubmit: async () => {
      setisLoading(true);
      const payload = {
        amount:values?.amount,
        name:values?.name,
      }
      const recurringObj =BillingArray.find((item)=>item.value == parseInt(values?.recurring))
      payload['recurringObj'] ={interval:recurringObj?.interval,interval_count:recurringObj?.interval_count}
      let resp = await addSubscription(payload);
      if(resp?.status){
          resetForm();
          setSuccessMsg(resp?.message)
          setTimeout(()=>{
            props.onHide(true);
          },2000);
        }else{
          setError(resp.message)
        }
    }
  })

  return (
    <div className="feedback-wrapper">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-user-modal"
        centered
      >
        <>
          <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
            Add New Subscription
          </Modal.Header>

          <Modal.Body className="change-password-body p-0 pt-2  text-center">
          <form onSubmit={handleSubmit} className="w-75" autoComplete="off">
              <div className={errors.name && touched.name ? "emailredborder inputdiv": "inputdiv"}>
                <span className="text-label">Package Name</span>
                <TextInput
                  label={"Package Name"}
                  name={"name"}
                  type={"text"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.name}
                  className={`mt-2 form-control ${
                    touched &&
                    touched[values?.name] &&
                    errors[values?.name]
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  errormsg={errors?.name}
                  touchedmsg={touched?.name}
                />
              </div>
              <div
                className={
                   errors.amount && touched.amount
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label">Cost</span>
                <TextInput
                  label={"Please enter cost"}
                  name={"amount"}
                  type={"number"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.amount}
                  className={`mt-2 form-control ${
                    touched &&
                    touched[values?.amount] &&
                    errors[values?.amount]
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  errormsg={errors?.amount}
                  touchedmsg={touched?.amount}
                />
              </div>

              <div
                className={
                  errors.recurring && touched.recurring
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label">Billing Cycle</span>
                <Form.Select
                  label={"Select Billing Cycle"}
                  name={"recurring"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.recurring}
                  className={`mt-2 form-control role-edit-select ${
                    touched && touched[values?.recurring] && errors[values?.recurring]
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="billingcycle" disabled className="role-item">
                  Billing Cycle
                  </option>
                 {BillingArray?.map((bill,index)=>{
                  return <option key={index+1} value={bill?.value} className="role-item">
                     {bill?.label}
                   </option>
                  }) 
                  }
                </Form.Select>
                <ErrorMessage
                  errormsg={errors?.recurring}
                  touchedmsg={touched?.recurring}
                />
              </div>

              <div className="edit-btns">
                <Button
                  variant=""
                  className="w-50 rounded-pill cancel-btn"
                  type="button"
                  onClick={()=>{resetForm();props?.onHide()}}
                  disabled={isSubmitting ? true:false}
                >
                  Cancel
                </Button>
                <Button
                  variant=""
                  className="w-50 rounded-pill save-btn"
                  type="submit"
                  disabled={isSubmitting ? true:false}
                >
                  Save
                </Button>
              </div>
            </form>
            {getError && (
              <ErrorMsg errormsg={getError} />
            )}
             {successMsg && (
               <SuccessMsg successmsg={successMsg} />
            )}
          </Modal.Body>
        </>
      </Modal>
    </div>
  )
}
export default AddSubscription
