import React, { useState, useEffect } from "react"
import { Modal, Button } from "react-bootstrap"
import TextInput from "../../../customComponents/TextInput"
import { useFormik } from "formik"
import { rootCategory } from "../../../utils/addRootValidations"
import ErrorMsg from "../../../customComponents/ErrorMsg"
import { addRootCategory,updateRootCategory } from "../../../api/request"
import ErrorMessage from "../../../customComponents/ErrorMessage"
import { formateDateTime } from "../../../utils/helpers"
import SuccessMsg from "../../../customComponents/SuccessMessage"
import Loader from "../../../customComponents/Spinner"

const AddNewRoot = props => {
  const [showAddSuccess, setshowAddSuccess] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [getError, setError] = useState(false)

  const {
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    touched,
    errors,
    isSubmitting
  } = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: rootCategory,
    onSubmit: async () => {
      setisLoading(true);
      const payLoadBody = {
        ...values,
      }
      if(props?.editdata?.id){
        payLoadBody.created = formateDateTime(values?.created);
      }
      try {
        let resp
        if(props?.editdata?.id){
          resp = await updateRootCategory(payLoadBody,props?.editdata?.id);
        }else{
          resp = await addRootCategory(payLoadBody);
        }
        if (resp?.status) {
          setshowAddSuccess(resp?.message);
          setError(false);
          setTimeout(() => {
            setisLoading(false);
            props?.onHide(resp?.status)
          }, 2000);
        } else {
          setshowAddSuccess(false)
          setisLoading(false)
          setError(resp?.message)
        }
      } catch (error) {
        setisLoading(false)
        setError(error?.message)
      }  
    }
  })

  useEffect(()=>{
    if(props?.editdata?.id){
      const fields = Object.keys(props?.editdata);
      fields.forEach(field => setFieldValue(field, props?.editdata[field] || "", false));
    }
  },[props.editdata])

  return (
    <div className="AddNewRoot-wrapper">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-new-modal root-modal"
        centered
      >
        <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
          Root Category
        </Modal.Header>
        <Modal.Body className="change-password-body p-0 pt-2  text-center">
          <form onSubmit={handleSubmit} className="w-40" autoComplete="off" >
            <div className={errors.name && touched.name ? "emailredborder": ""}>
              <span className="text-label">Name</span>
              <TextInput
                label={"Please enter name"}
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
            {isLoading && <Loader loadingMsg={props?.editdata?.id? "Updating...":"Adding..."}/>}
            <div className="btn-wrapper">
              <Button
                className="cancel-btn w-25"
                variant="outline-primary rounded-pill"
                onClick={() => {resetForm(); props?.onHide()}}
                disabled={isLoading || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="save-btn w-25"
                variant="primary rounded-pill"
                type="submit"
                disabled={isLoading || isSubmitting}
              >
                {props?.editdata?.id ? "Update":"Add"}
              </Button>
            </div>
          </form>

          <>
          {getError && (
              <ErrorMsg errormsg={getError} />
            )}
             {showAddSuccess && (
               <SuccessMsg successmsg={showAddSuccess} />
            )}
          </>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AddNewRoot
