import React, { useState } from "react"
import { Modal, Button, Col, Row, Form } from "react-bootstrap"
import TextInput from "../../../customComponents/TextInput"
import { useFormik } from "formik"
import { recipeSchema } from "../../../utils/addRecipeValidations"
import ErrorMsg from "../../../customComponents/ErrorMsg"
import ErrorMessage from "../../../customComponents/ErrorMessage"
import "./recipegroup.scss"

const EditRecipeGroup = props => {
  const [showAddSuccess, setshowAddSuccess] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [getError, setError] = useState(false)

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
    initialValues: {
      username: props?.editdata || ""
    },
    validationSchema: recipeSchema,
    onSubmit: async () => {
      console.log(values)
      setisLoading(true)
      const addUserbody = {
        username: values?.username
      }
      // console.log("adduserbody", addUserbody)
      // let resp = await addUser(addUserbody)
      // console.log("resp from adduserbody", resp)
      // if (resp?.status === true) {
      //   setshowAddSuccess(true)
      //   setisLoading(false)
      //   setError(false)
      // } else {
      //   setshowAddSuccess(false)
      //   setisLoading(false)
      //   setError(true)
      // }
    }
  })

  return (
    <div className="AddRecipeGroup-wrapper">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-new-modal recipe-add-modal"
        centered
      >
        <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
          Edit Recipe Group
        </Modal.Header>
        <Modal.Body className="change-password-body p-0 pt-2  text-center">
          <form onSubmit={handleSubmit} className="w-100">
            <div
              className={
                errors.username && touched.username && errors.username
                  ? "emailredborder"
                  : ""
              }
            >
              <span className="text-label">Name</span>
              <TextInput
                label={"Please type in a name"}
                name={"username"}
                type={"text"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                className={`mt-2 form-control ${
                  touched &&
                  touched[values?.username] &&
                  errors[values?.username]
                    ? "is-invalid"
                    : ""
                }`}
              />
              <ErrorMessage
                errormsg={errors?.username}
                touchedmsg={touched?.username}
              />
            </div>

            <div className="btn-wrapper">
              <Button
                className="cancel-btn w-25"
                variant="outline-primary rounded-pill"
                onClick={() => props?.onHide()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="save-btn w-25"
                variant="primary rounded-pill"
                type="submit"
                disabled={isLoading}
              >
                Update
              </Button>
            </div>
          </form>

          <>
            {getError === true && (
              <ErrorMsg errormsg={"Error in editing Recipe Group"} />
            )}
            {showAddSuccess === true && (
              <span className="rstPassSuccessMsg text-center font-medium-20 mt-3 d-flex justify-content-center align-items-center">
                Recipe Group has been updated successfully
              </span>
            )}
          </>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default EditRecipeGroup
